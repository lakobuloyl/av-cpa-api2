//this api is for displaying of mock exams
// API version 1 
// Earl

const mongoose = require('mongoose');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next) {
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    const course_id = req.body.course_id || 0;
    const is_draft = 2;

    const
    getMockExams = () => {
        //console.log("id: " + req.body.course_id);
        if(membership_type === 0) {
            if(course_id) {
                return mock_exam.find({
                    is_archived: false,
                    course_id: course_id
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return mock_exam.find({
                    is_archived: false
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
        else {
            if(course_id) {
                return mock_exam.find({
                    is_archived: false,
                    course_id: course_id,
                    created_by: _id
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return mock_exam.find({
                    is_archived: false,
                    created_by: _id
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
        
    },
    getNumberOfPages = (mock_exams) => {
        return Math.ceil(mock_exams.length / limit);
    },
    getPagedMockExams = (mock_exams) => {
        var drop_mock_exam = _.drop(mock_exams, (limit * page) - limit);
        var take_mock_exam = _.take(drop_mock_exam, limit);
        
        return take_mock_exam;
    },
    mapMockExams = (mock_exams) =>{
        return mock_exams.map(mock_exams_display => {
            const {
                _id, mock_exam_name, mock_exam_description, course_id, 
                question_list, 
                attempts, no_of_questions, is_draft
            } = mock_exams_display;

            if(is_draft) {
                var status = "Draft";
            }
            else {
                var status = "Published";
            }

            return {
                _id, mock_exam_name, mock_exam_description, course_id, 
                question_list, 
                attempts, no_of_questions, status
            };
        });

    };
    
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var mock_exams = await getMockExams();
                //console.log(mock_exams);

                if(mock_exams.length > 0){
                    var number_of_pages = await getNumberOfPages(mock_exams);
                    var paged_mock_exams = await getPagedMockExams(mock_exams);
                    var display_mock_exams = await mapMockExams(paged_mock_exams);
                    res.send(200, {code: "Success", msg : "Mock exams retrieved", number_of_pages, display_mock_exams});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No mock exams to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log("Error2: " + e);
            res.send(500, {code: "Failed", msg : "No mock exams to display", e});
        }
    }

    main ();
}