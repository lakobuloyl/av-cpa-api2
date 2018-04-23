//this api is for adding of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const question = require('../../../../../models/questions.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash');

module.exports = function(req, res, next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const { assessment_id, lesson_id, mock_exam_id } = req.body;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getAllQuestions = () => {
        return question.find({
            questions_on_archive: 0
        }).populate({
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
    },
    getMockExam = (mock_exam_id) => {
        return mock_exam.findOne({ _id: mock_exam_id }).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestionsByAssessment = (questions) => {
        if(assessment_id) {
            return _.filter(questions, (element) => {
                return element.assessment_id._id == assessment_id;
            });
        }
        else {
            return questions;
        }
    },
    getQuestionsByLesson = (questions) => {
        if(lesson_id) {
            return _.filter(questions, (element) => {
                return element.lesson_id._id == lesson_id;
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

        //console.log(mock_questions);
        _.forEach(all_questions, (element) => {
            var new_set = {
                _id: element._id,
                lesson_id: element.lesson_id,
                assessment_id: element.assessment_id,
                course_id: element.course_id,
                question: element.question,
                answer_key: element.answer_key,
                choices: element.choices
            }

            to_push = new_set;
            
            _.forEach(mock_questions, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    //console.log(element2._id.toString());
                    //console.log("is mock : " + element._id.toString());
                    //all_questions[i]["is_mock"] = true;
                    //console.log("is mock2 : " + element.is_mock);
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
                        choices: element2.choices
                    }
                    to_push = new_set;
                    list.push(to_push);
                }
            });
            //console.log("is  : " + to_push.is_mock);
            
        });
        //}

        
        return list;
    },
    mapQuestions = (questions) =>{
        return questions.map(display => {
            const {
                question, answer_key, choices, time_limit
            } = display;

            return {
                question, answer_key, choices, time_limit
            };
        });
    };;

    async function main() {
        try {
             // if(membership_type === 1)
            // {
                var questions = await getAllQuestions();
                

                    //NON-0 YUNG mock exam id
                    var get_mock_exam = await getMockExam(mock_exam_id);
                    //console.log("has mock");
                    var compared_questions = await compareQuestions(questions, get_mock_exam.question_list, mock_exam_id);
                    //console.log("mocks: " + compared_questions);
                    questions = compared_questions;
                    questions_to_page = questions;
                

                //res.send(compared_questions);
                if(questions.length > 0) {
                    
                        if(lesson_id) {
                            //NON-0 YUNG LESSON ID
                            var questions_by_lesson = await getQuestionsByLesson(questions);
                            questions_to_page = questions_by_lesson;
                            //var paged_questions = await getPagedQuestions(questions_by_lesson);

                            //var chunk_questions = await chunkQuestions(questions_by_lesson);
                            //res.send(200, {code: "Success", msg : "Questions retrieved", paged_questions});
                        }
                        else {
                            if(assessment_id) {
                                //NON-0 YUNG ASSESSMENT ID
                                var questions_by_assessment = await getQuestionsByAssessment(questions);
                                questions_to_page = questions_by_assessment;
                                //var chunk_questions = await chunkQuestions(questions_by_assessment);
                                //res.send(200, {code: "Success", msg : "Questions retrieved", chunk_questions});
                            }
                        }

                        var paged_questions = await getPagedQuestions(questions_to_page);
                        res.send(200, {code: "Success", msg : "Questions retrieved", paged_questions});
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "Questions not found"});
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