// This API is for creating mock exams.
// API version 1 
// Earl

const mongoose = require('mongoose');
const question = require('../../../../../models/questions.js');
const course = require('../../../../../models/course.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { _id, membership_type } = decodeToken(req.headers['x-access-token']);

    const
    getExamDetails = () => {
        const new_mock_exam = Object.assign({}, req.body);
        return new_mock_exam;
    },
    getCourse = () =>{
        return course.findOne({
            _id: req.body.course_id, 
            is_draft: true
        }).then(data =>{
            return data;
        }).catch(err=>{
            throw err;
        })
    },
    createMockExam = (question_list) => {
        const { course_id, mock_exam_name, mock_exam_description, no_of_questions, total_time, is_draft } = req.body;

        if(membership_type === 0) {
            var new_is_draft = is_draft;
        }
        else {
            var new_is_draft = 1;
        }

        return mock_exam.create({
            course_id: course_id, 
            mock_exam_name: mock_exam_name,
            mock_exam_description: mock_exam_description, 
            question_list: question_list,
            //no_of_questions: question_list.length
            no_of_questions: no_of_questions,
            total_time: total_time, 
            is_draft: new_is_draft,
            created_by: _id
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    getQuestionsByCourse = () => {
        return question.find({course_id: req.body.course_id}).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    compareQuestions = (question_list, questions_by_course) => {
        var list = [];

        _.forEach(question_list, (element) => {
            _.forEach(questions_by_course, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    list.push(element2);
                }
            });
            
        });
        
        return list;
    },
    getMockExam = (new_mock_exam) => {
        return mock_exam.findOne( mock_exam ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }

    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1) {       
                var get_course = await getCourse();
                if(get_course) {
                    var questions_by_course = await getQuestionsByCourse();
                    var question_list = await compareQuestions(req.body.question_list, questions_by_course);
                    var new_mock_exam = await createMockExam(question_list);

                    res.send(200, {code: "SUCCESS", msg: "Mock exam successfully created.", new_mock_exam});
                }         
                else {
                    res.send(409,{code:"CONFLICT", message: "Cannot add. This course is not a draft."});
                }
            }
            else {
                res.send(403, {code: "FORBIDDEN", msg: "Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while creating a mock exam.", e});
        }
    }

    main();
}