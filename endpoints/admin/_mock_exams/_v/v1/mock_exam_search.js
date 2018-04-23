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
    //var { _id,mock_exam_on_archive=0 } = req.params;
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    //console.log("asd")
    const
    getMockExams = () => {
        if(membership_type === 0) {
            if(_id != 0) {
                return mock_exam.find( { 
                    $or:[
                        { _id: mongoose.Types.ObjectId(_id)}  
                    ],
                    is_archived: 0 
                }).sort({ is_draft: -1 }).
                populate({
                    path: "course_id",
                    select: "course_name"
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return mock_exam.find( { 
                    is_archived: 0 
                }).sort({ is_draft: -1 }).
                populate({
                    path: "course_id",
                    select: "course_name"
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            if(_id != 0) {
                return mock_exam.find( { 
                    $or:[
                        { _id: mongoose.Types.ObjectId(_id)}  
                    ],
                    is_archived: 0,
                    created_by: user_id
                }).sort({ is_draft: -1 }).
                populate({
                    path: "course_id",
                    select: "course_name"
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return mock_exam.find( { 
                    is_archived: 0,
                    created_by: user_id
                }).sort({ is_draft: -1 }).
                populate({
                    path: "course_id",
                    select: "course_name"
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
    },
    getMockExamsByUser = (mock_exams) => {
        try{
            const user_id = decodeToken(req.headers['x-access-token'])._id;
            if(membership_type === 1) {
                return _.filter(mock_exams, (element) => {
                    return element.created_by.toString() === user_id.toString();
                });
            }
            else {
                return mock_exams;
            }
        }
        catch(e){
            console.log("error:"+e);
        }
    },
    getMockExamsByCourse = () => {
        var course_id = req.body.course_id || "";

            if(membership_type === 0) {
                return mock_exam.find({
                    is_archived: 0,
                    course_id: course_id,
                    mock_exam_name: {$regex: _.escapeRegExp(search), $options: 'i'}
                }).sort({ is_draft: -1 }).
                populate({
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

                return mock_exam.find({
                    is_archived: 0,
                    created_by: user_id,
                    course_id: course_id,
                    mock_exam_name: {$regex: _.escapeRegExp(search), $options: 'i'}
                }).sort({ is_draft: -1 }).
                populate({
                    path: "course_id",
                    select: "course_name"
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        
    },
    getAllQuestions = () => {
        return question.find({}).
        populate({
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
    mapMockExam = (mock_exams, all_questions) => {
        return mock_exams.map(mock_exams_display => {
            const {
                _id, mock_exam_name, mock_exam_description, no_of_questions, course_id, question_list, is_draft
             } = mock_exams_display;

            //console.log("course-id - " + course_id);
            var map_question_list = [];

            all_questions.forEach(element => { //console.log("all: "+element._id.toString());
                question_list.forEach(element2 => {
                    const { _id, choices, explaination, question, answer_key, time_limit } = element2;
                    
                    if(element._id.toString() === _id.toString()) {
                        //console.log(element._id.toString() + " - " + _id.toString());
                        var new_set = {
                            _id: _id,
                            lesson_id: {
                                _id: element.lesson_id._id,
                                lesson_name: element.lesson_id.lesson_name
                            },
                            assessment_id: {
                                _id: element.assessment_id._id,
                                assessment_name: element.assessment_id.assessment_name
                            },
                            course_id: {
                                id: element.course_id._id,
                                course_name: element.course_id.course_name
                            },
                            question: question,
                            choices: choices, 
                            explaination: explaination,
                            answer_key: answer_key,
                            time_limit: time_limit
                        }

                        map_question_list.push(new_set);
                    }
                });
            });
            //console.log("qlist: " + map_question_list);
            
            if(is_draft) {
                var status = "Draft";
            }
            else {
                var status = "Published";
            }

            return {
                _id, mock_exam_name, mock_exam_description, no_of_questions, course_id, map_question_list, status
            };
        });
    },
    getNumberOfPages = (mock_exams) => {
        return Math.ceil(mock_exams.length / limit);
    },
    getPagedMockExams = (mock_exams) => {
        var drop_mock_exam = _.drop(mock_exams, (limit * page) - limit);
        var take_mock_exam = _.take(drop_mock_exam, limit);
        
        return take_mock_exam;
    },
    searchMockExams = (mock_exams) => {
        //console.log(mock_exams[0]);
        var course_id = req.body.course_id || "";
        return _.filter(mock_exams, (element) => {
            var x = new RegExp(_.escapeRegExp(search), "i");
            //console.log("x: " + element.course_id.course_name + " - " + element.assessment_name.match(/search/g));
            return (x.test(element.course_id.course_name) || x.test(element.mock_exam_name)) 
            && element.course_id._id.toString() === course_id.toString();
        });
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var mock_exams = await getMockExams();
                var mock_exams_by_user = await getMockExamsByUser(mock_exams);
                mock_exams = mock_exams_by_user;
                
                if(mock_exams.length > 0) {
                    var all_questions = await getAllQuestions();
                    if(_id == 0) {
                        var search_mock_exams = await searchMockExams(mock_exams);
                        mock_exams = search_mock_exams;
                    }
                    //console.log("mock: " + mock_exams[0]._id);
                    //console.log("all: " + all_questions);
                    var number_of_pages = await getNumberOfPages(mock_exams);
                    var paged_mock_exams = await getPagedMockExams(mock_exams);
                    var display_mock_exam = await mapMockExam(paged_mock_exams, all_questions);
                    res.send(200, {code: "SUCCESS", msg : "Mock exams retrieved", number_of_pages, display_mock_exam});
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "No mock exams to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "No mock exams to display", e});
        }
    }

    main ();
}