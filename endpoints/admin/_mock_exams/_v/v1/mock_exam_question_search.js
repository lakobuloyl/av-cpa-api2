//this api is for displaying of mock exams
// API version 1
// Earl

const mongoose = require('mongoose');
const mock_exam = require('../../../../../models/mock_exam.js');
const question = require('../../../../../models/questions.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    var { _id } = req.params || "";
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var search = req.body.search || "";
    var course_id = req.body.course_id || "";

    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    
    const
    getMockExam = () => {
        if(membership_type === 0) {
            return mock_exam.findOne({
                _id: _id,
                is_archived: 0
            }).populate({
                path: "course_id",
                select: "course_name"
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            return mock_exam.findOne( {
                _id: _id,
                is_archived: 0, 
                created_by: user_id
            }).populate({
                path: "course_id",
                select: "course_name"
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
    },
    getNumberOfPages = (questions) => {
        return Math.ceil(questions.length / limit);
    },
    getQuestionsByCourse = () => {
        if(membership_type === 0) {
            return question.find({
                course_id: course_id,
                questions_on_archive: 0,
                question: {$regex: _.escapeRegExp(search), $options: 'i'}  
                //is_draft: is_draft
            }).sort({ is_draft: -1 }).
                populate({
                    path : "lesson_id",
                    select: "lesson_name"
                }).populate({
                    path : "assessment_id",
                    select: "assessment_name"
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            return question.find({
                course_id: course_id,
                questions_on_archive: 0,
                question: {$regex: _.escapeRegExp(search), $options: 'i'},
                created_by: user_id
                //is_draft: is_draft
            }).sort({ is_draft: -1 }).
                populate({
                    path : "lesson_id",
                    select: "lesson_name"
                }).populate({
                    path : "assessment_id",
                    select: "assessment_name"
                }).populate({
                    path : "course_id",
                    select: "course_name"
                }).exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
        
    },
    getPagedQuestions = (questions) => {
        var drop_questions = _.drop(questions, (limit * page) - limit);
        var take_questions = _.take(drop_questions, limit);
        
        return take_questions;
    },
    searchQuestions = (question_list) => {
        return _.filter(question_list, (element) => {
            var x = new RegExp(_.escapeRegExp(search), "i");
            return x.test(element.question);
        });
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                if(_id) {
                    var get_mock_exam = await getMockExam();
                    if(get_mock_exam) {
                        var found_questions = await searchQuestions(get_mock_exam.question_list);
                        var number_of_pages = await getNumberOfPages(found_questions);
                        var paged_questions = await getPagedQuestions(found_questions);
                            
                        res.send(200, {code: "SUCCESS", msg : "Questions retrieved", number_of_pages, paged_questions});
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "No questions to display"});
                    }
                }
                else {
                    var found_questions = await getQuestionsByCourse();
                    var number_of_pages = await getNumberOfPages(found_questions);
                    var paged_questions = await getPagedQuestions(found_questions);
                            
                    res.send(200, {code: "SUCCESS", msg : "Questions retrieved", number_of_pages, paged_questions});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "No questions to display", e});
        }
    }

    main ();
}