// This API is for editing of mock exam details.
// API version 1 
// Earl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
const question = require('../../../../../models/questions.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const
    getMockExam = (mock_exam_id) => {
        return mock_exam.findOne({ _id: mock_exam_id }).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    /*getQuestionList = (found_mock_exam) => {
        return found_mock_exam.question_list;
    },*/
    getQuestionsByCourse = (course_id) => {
        return question.find({course_id: course_id}).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    compareQuestions = (new_question_list, questions_by_course) => {
        var list = [];
        
        _.forEach(new_question_list, (element) => {
            _.forEach(questions_by_course, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    list.push(element2);
                }
            });
            
        });
        
        return list;
    },
    updateMockExam = (mock_exam_id, new_question_list) => {
        return mock_exam.findByIdAndUpdate(mock_exam_id, 
            { $set: { 
                "question_list": new_question_list,
                "mock_exam_name": req.body.mock_exam_name,
                "mock_exam_description": req.body.mock_exam_description,
                //"no_of_questions": new_question_list.length
                "no_of_questions": req.body.no_of_questions,
                "total_time": req.body.total_time
            } }, {new: true}).
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                const { mock_exam_id } = req.body;
                const new_question_list = req.body.question_list;

                var get_mock_exam = await getMockExam(mock_exam_id);
                var questions_by_course = await getQuestionsByCourse(get_mock_exam.course_id);
                var question_list = await compareQuestions(new_question_list, questions_by_course);

                var updated_mock_exam = await updateMockExam(mock_exam_id, question_list);

                res.send(200, { code: "SUCCESS", msg: "Updated mock exam", updated_mock_exam });
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid Account Access" });
            }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while displaying questions per mock exam.", e});
        }
    }

    main();
}