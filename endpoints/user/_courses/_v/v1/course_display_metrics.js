//this api is for displaying course metrics by id
// API version 1
// Earl

const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const exam_logs = require('../../../../../models/exam_logs'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){ 
    const { _id, membership_type } = decodeToken(req.headers['x-access-token']);
    const { course_id } = req.body;
    var highest = 0, lowest = 0, sum = 0;
    var exam_names = [], exam_grades = [];

    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    //EITHER MOCK EXAMS OR CUSTOM ASSESSMENTS (STUDY AND ACTUAL) ONLY. BAWAL SILA MAGSAMA.
    
    const
    getExamLogsByMode = (is_mock) => {
        if(is_mock) {
            //MOCK EXAMS ANG IRERETURN
            return exam_logs.find({
                user_id: _id,
                course_id: course_id,
                exam_mode: "Mock exam"
            })
            .sort({exam_date:1})
            .populate({
                path:'course_id',
                select:'course_name'
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
        else {
            //NON-MOCK EXAMS ANG IRERETURN
            return exam_logs.find({
                user_id: _id,
                course_id: course_id,
                exam_mode: { $not: { $eq: "Mock exam" }}
            }).populate({
                path:'course_id',
                select:'course_name'
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
    },
    mapLast10Logs = (last_10_logs) => {
        lowest = Math.round(last_10_logs[0].correct / last_10_logs[0].total * 100);
        //console.log(lowest);

        _.forEach(last_10_logs, (element) => {
            const { exam_name, correct, total } = element;
            var grade = Math.round(correct / total * 100);

            sum += grade;

            if(grade > highest) {
                highest = grade;
            }

            if(grade < lowest) {
                lowest = grade;
            }

            exam_names.push(exam_name);
            exam_grades.push(grade);
        });

        //return { exam_names, exam_grades };

        /*return last_10_logs.map(element => {
            const { exam_name, correct, total } = element;
            var grade = Math.round(correct / total * 100);

            sum += grade;

            if(grade > highest) {
                highest = grade;
            }

            if(grade < lowest) {
                lowest = grade;
            }

            return {
                exam_name, grade
            };
        });*/
    },
    mapExamHistory = (get_logs) => {
        //exam name, no of questions, correct, incorrect, skipped, flagged, duration, start time, grade
        return get_logs.map(element => {
            var { _id, exam_name, total, correct, incorrect, skipped, flagged, duration, exam_date, exam_mode, mock_exam_id, course_id , is_done} = element;
            var grade = Math.round(correct / total * 100);

            if(exam_mode !== "Mock exam") {
                exam_id = course_id._id;
            }
            //console.log(exam_mode);

            return { _id, exam_name, total, correct, incorrect, skipped, flagged, duration, exam_date, exam_mode, grade, mock_exam_id ,is_done};
        });
    },
    getLast10Logs = (exam_sessions) => {
        var sorted_logs = _.sortBy(exam_sessions, (o) => { 
            return new moment(o.exam_date); 
        }).reverse();

        var take10 = _.take(sorted_logs, 10);
        return take10;
    };  
    getNumber = (exam_history) => {
        return Math.ceil(exam_history.length / limit);
    },
    getPaged = (exam_history) => {
        var drop_course = _.drop(exam_history, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        _.pull(take_course, undefined);
        //console.log(take_course);
        if(take_course.length > 0) {
            return take_course;
        }
        else {
            return [];
        }
    };
    async function main() {
        try {
            const { is_mock_history, is_mock_metrics } = req.body;
            var average = 0;
            var get_logs_metrics = await getExamLogsByMode(is_mock_metrics);
            //console.log("Metrics: "+ get_logs_metrics.length);

            if(get_logs_metrics.length > 0) {//console.log("Metrics2: "+ get_logs_metrics);
                var no_of_assessments = get_logs_metrics.length;
                var last_10_logs = await getLast10Logs(get_logs_metrics);
                //var exam_metrics = await mapLast10Logs(last_10_logs);
                await mapLast10Logs(last_10_logs);
                //var average = 0;
                if(exam_grades.length > 0) {
                    average = Math.round(sum / exam_grades.length);
                }
            }
            else {
                var no_of_assessments = 0;
                var last_10_logs = [];

            }
            
            var get_logs_history = await getExamLogsByMode(is_mock_history);
            if(get_logs_history) {
                var exam_history = await mapExamHistory(get_logs_history);
                var get_page_number = await getNumber(exam_history);
                var exam_history_page = await getPaged(exam_history);
            }   

            //console.log(sum + " / " + map_exam_metrics.length + " = " + average);
            //console.log("met: "+ exam_names);
            res.send(200, {code: "Success", msg : "Metrics successfully fetched", no_of_assessments, average, highest, lowest, exam_names, exam_grades, exam_history_page,get_page_number});
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}