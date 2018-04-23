//this api is for adding of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const question = require('../../../../../models/questions.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');;

module.exports = function(req, res, next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const { assessment_by, course_by, lesson_by, mock_exam_id } = req.body;
    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getQuestions = () => {
        if(membership_type === 0) {
            if(is_draft === 2) {
                return question.find({
                    questions_on_archive: 0
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
                return question.find({
                    questions_on_archive: 0,
                    is_draft: is_draft
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
        }
        else {
            if(is_draft === 2) {
                return question.find({
                    questions_on_archive: 0,
                    created_by: _id
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
                return question.find({
                    questions_on_archive: 0,
                    is_draft: is_draft,
                    created_by: _id
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
        }
        
    },
    getMockExam = (mock_exam_id) => {
        return mock_exam.findOne({ _id: mock_exam_id }).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestionsByCourse = (questions) => {
        if(course_by) {
            return _.filter(questions, (element) => {
                return element.course_id._id == course_by;
            });
        }
        else {
            return questions;
        }
    },
    getQuestionsByAssessment = (questions) => {
        if(assessment_by) {
            return _.filter(questions, (element) => {
                return element.assessment_id._id == assessment_by;
            });
        }
        else {
            return questions;
        }
    },
    getQuestionsByLesson = (questions) => {
        if(lesson_by) {
            return _.filter(questions, (element) => {
                return element.lesson_id._id == lesson_by;
            });
        }
        else {
            return questions;
        }
    },
    getPagedQuestions = (questions) => {
        var drop_question = _.drop(questions, (limit * page) - limit);
        var take_question = _.take(drop_question, limit);
        
        return take_question;
    },
    compareQuestions = (all_questions, mock_questions) => {
        var list = [];

        _.forEach(all_questions, (element) => {
            var new_set = {
                _id: element._id,
                lesson_id: element.lesson_id,
                assessment_id: element.assessment_id,
                course_id: element.course_id,
                question: element.question,
                answer_key: element.answer_key,
                choices: element.choices,
                explaination: element.explaination,
                is_mock: false
            }

            to_push = new_set;
            
            _.forEach(mock_questions, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    var new_set = {
                        _id: element2._id,
                        lesson_id: { 
                            "_id": element2.lesson_id, 
                            lesson_name: element.lesson_id.lesson_name ,
                        },
                        assessment_id: { 
                            "_id": element2.assessment_id, 
                            assessment_name: element.assessment_id.assessment_name ,
                        },
                        course_id: { 
                            "_id": element2.course_id, 
                            course_name: element.course_id.course_name ,
                        },
                        question: element2.question,
                        answer_key: element2.answer_key,
                        choices: element2.choices,
                        explaination: element2.explaination,
                        is_mock: true
                    }
                    to_push = new_set;
                }
            });
            list.push(to_push);
        });
        
        return list;
    },
    getNumberOfPages = (questions) => {
        return Math.ceil(questions.length / limit);
    },
    mapQuestions = (questions) =>{
        return questions.map(display => {
            const {
                _id, lesson_id, assessment_id, course_id, question,
                answer_key, choices, time_limit, explaination, is_mock, is_draft
            } = display;

            if(is_draft) {
                var status = "Draft";
            }
            else {
                var status = "Published";
            }

            return {
                _id, lesson_id, assessment_id, course_id, question,
                answer_key, choices, time_limit, explaination, is_mock: false, status
            };
        });
    };

    async function main() {
        try {
             // if(membership_type === 1)
            // {
                var questions = await getQuestions();
                
                if(mock_exam_id) {
                    //NON-0 YUNG mock exam id
                    console.log("has mock");
                    var get_mock_exam = await getMockExam(mock_exam_id);
                    var compared_questions = await compareQuestions(questions, get_mock_exam.question_list);
                    questions = compared_questions;
                }
                else {
                    console.log("no mock");
                    var formatted_questions = await mapQuestions(questions);
                    questions = formatted_questions;
                }
            
                if(questions.length > 0) {
                    //var questions_by_draft = await getQuestionsByDraft(questions);
                    //var questions_to_page = questions_by_draft;
                    questions_to_page = questions;
                    //if(questions_by_draft.length > 0) {
                        if(lesson_by) {
                            //NON-0 YUNG LESSON ID
                            var questions_by_lesson = await getQuestionsByLesson(questions);
                            questions_to_page = questions_by_lesson;
                        }
                        else {
                            if(assessment_by) {
                                //NON-0 YUNG ASSESSMENT ID
                                var questions_by_assessment = await getQuestionsByAssessment(questions);
                                questions_to_page = questions_by_assessment;
                            }
                            else {
                                //course_by
                                if(course_by) {
                                    var questions_by_course = await getQuestionsByCourse(questions);
                                    questions_to_page = questions_by_course;
                                }
                            }
                        }

                        if(questions_to_page.length > 0) {
                            var number_of_pages = getNumberOfPages(questions_to_page);
                            var paged_questions = await getPagedQuestions(questions_to_page);
                            //var map_questions = await mapQuestions(paged_questions);
                            res.send(200, {code: "Success", msg: "Questions retrieved", number_of_pages, paged_questions});
                        }
                        else {
                            res.send(404, {code: "NOT FOUND", msg: "Questions not found"});
                        }
                    /*}
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "Questions not found"});
                    }*/
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "Questionaire not found"}); 
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Questionaire", e});
        }
    }

    main ();
}