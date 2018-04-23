// This API is for displaying of questions by mock exam ID.
// API version 1 
// Earl

const mongoose = require('mongoose');
const mock_exam = require('../../../../../models/mock_exam.js');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js');
const lesson = require('../../../../../models/lessons.js');
const question = require('../../../../../models/questions.js');
const _ = require('lodash');

module.exports = function(req, res, next){
    const
    getMockExam = (mock_exam_id) => {
        return mock_exam.findOne({ _id: mock_exam_id })
        
        .
        /*populate({
            path: "question_list.course_id",
            select: "course_name"
        }).populate({
            path: "question_list.assessment_id",
            select: "assessment_name"
        }).populate({
            path: "question_list.lesson_id",
            select: "lesson_name"
        }).*/then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getCourse = () => {
        return course.find().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getAssessment = () => {
        return assessment.find().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getLesson = () => {
        return lesson.find().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestion = (course_id) => {
        return question.find({
            course_id: course_id,
            questions_on_archive: 0
        })

        .populate({
            path: "course_id",
            select: "course_name"
        }).populate({
            path: "assessment_id",
            select: "assessment_name"
        }).populate({
            path: "lesson_id",
            select: "lesson_name"
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapMockExam = (found_mock_exam, /*course_list, assessment_list, lesson_list,*/ all_questions) => {
        var list = [];

        const { 
            mock_exam_name,
            mock_exam_description, 
            //no_of_questions, 
            //total_time, 
            question_list 
        } = found_mock_exam;

        _.forEach(all_questions, (element) => {
            /*const get_course = _.filter(course_list, {_id: element.course_id});
            const course_name = get_course[0].course_name;
            
            const get_assessment = _.filter(assessment_list, {_id: element.assessment_id});
            const assessment_name = get_assessment[0].assessment_name;

            const get_lesson = _.filter(lesson_list, {_id: element.lesson_id});
            const lesson_name = get_lesson[0].lesson_name;*/
            //const { _id}
            
            var new_set = {
                _id: element._id,
                lesson_data: {
                    lesson_id: element.lesson_id._id,
                    lesson_name: element.lesson_id.lesson_name
                },
                assessment_data: {
                    assessment_id: element.assessment_id._id,
                    assessment_name: element.assessment_id.assessment_name
                },
                course_data: {
                    course_id: element.course_id._id,
                    course_name: element.course_id.course_name
                },
                question: element.question,
                time_limit: element.time_limit,
                is_mock: false
            }

            to_push = new_set;

            _.forEach(question_list, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    const { lesson_id, assessment_id, course_id, question, is_mock } = element2;

                    var new_set = {
                        _id: element._id,
                        lesson_data: {
                            lesson_id: element.lesson_id._id,
                            lesson_name: element.lesson_id.lesson_name
                        },
                        assessment_data: {
                            assessment_id: element.assessment_id._id,
                            assessment_name: element.assessment_id.assessment_name
                        },
                        course_data: {
                            course_id: element.course_id._id,
                            course_name: element.course_id.course_name
                        },
                        question: element.question,
                        time_limit: element.time_limit,
                        is_mock: true
                    }
                    //new_set.is_mock = true;

                    to_push = new_set;
                }
            });

            console.log("lesson: "+element._id, element.lesson_id);
            list.push(to_push);
        });

        return {
            mock_exam_name,
            mock_exam_description, 
            //no_of_questions, 
            //total_time, 
            list
        };

        //return found_mock_exam.question_list;
    };

    async function main() {
        try {
            const { mock_exam_id } = req.body;

            var get_mock_exam = await getMockExam(mock_exam_id);
            //var course_list = await getCourse();
            //var assessment_list = await getAssessment();
            //var lesson_list = await getLesson();
            var question_list = await getQuestion(get_mock_exam.course_id);
            //console.log(question_list);
            var map_mock_exam = await mapMockExam(get_mock_exam, question_list);
            //var map_mock_exam = await mapMockExam(get_mock_exam, course_list, assessment_list, lesson_list, question_list);
            //console.log(get_mock_exam);
            res.send(200, {code: "SUCCESS", msg: "Mock exam found", map_mock_exam});
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while displaying questions per mock exam.", e});
        }
    }

    main();
}