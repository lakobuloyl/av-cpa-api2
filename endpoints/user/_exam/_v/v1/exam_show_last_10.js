//this api is for show last 10 assessments
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
    var highest = 0, lowest = 0, sum = 0;
    
    const
    getExamLogsByMode = (is_mock) => {
        if(is_mock) {
            //MOCK EXAMS ANG IRERETURN
            return exam_logs.find({
                user_id: _id,
                course_id: course_id,
                exam_mode: "Mock exam"
            }).populate({
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
    getLast10Logs = (exam_sessions) => {
        var sorted_logs = _.sortBy(exam_sessions, (o) => { 
            return new moment(o.exam_date); 
        }).reverse();

        var take10 = _.take(sorted_logs, 10);
        return take10;
    };  
    mapLast10Logs = (last_10_logs) => {
        return last_10_logs.map(element => {
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
        });
    },
    getExamModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Exam Mode"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getStudyModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Study Mode"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getMockModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Mock exam"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getMergedModes = (exam_modes, study_modes, mock_modes) => {
        return _.concat(exam_modes, study_modes, mock_modes);
    },
    mapLogs = (last_10_logs) => {
        return last_10_logs.map(element => {
            const { exam_name, correct } = element;
            sum += correct;

            if(correct > highest) {
                highest = correct;
            }

            if(correct < lowest) {
                lowest = correct;
            }

            return {
                exam_name, correct
            };
        });
    },
    getLast10Logs = (exam_sessions) => {
        var sorted_logs = _.sortBy(exam_sessions, (o) => { 
            return new moment(o.exam_date); 
        }).reverse();

        var take10 = _.take(sorted_logs, 10);
        return take10;
    };
    async function main() {
        try {
            const { is_mock_metrics } = req.body;

            var get_logs_metrics = await getExamLogsByMode(is_mock_metrics);
            var no_of_assessments = get_logs_metrics.length;
            var last_10_logs = await getLast10Logs(get_logs_metrics);
            var exam_metrics = await mapLast10Logs(last_10_logs);

            var average = 0;
            if(exam_metrics.length > 0) {
                average = Math.round(sum / exam_metrics.length);
            }

            res.send(200, {code: "Success", msg : "Metrics successfully fetched", no_of_assessments, average, highest, lowest, exam_metrics});
            /*var exam_modes = [], study_modes = [], mock_modes = [];

            if(exam_mode) {
                exam_modes = await getExamModes();
            }

            if(study_mode) {
                study_modes = await getStudyModes();
            }

            if(mock_mode) {
                mock_modes = await getMockModes();
            }

            var merged_modes = await getMergedModes(exam_modes, study_modes, mock_modes);
            var last_10_logs = await getLast10Logs(merged_modes);
            var map_logs = await mapLogs(last_10_logs);

            average = sum / 10;
            
            res.send(200, {code: "Success", msg : "logs successfully fetched", average, highest, lowest, map_logs});*/
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}