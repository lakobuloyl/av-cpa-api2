//this api is for search of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const question = require('../../../../../models/questions.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

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
                if(_id != 0) {
                    return question.find( { 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        questions_on_archive:0 
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
                        questions_on_archive:0 
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
                if(_id != 0) {
                    return question.find( { 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
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
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            if(is_draft === 2) {
                if(_id != 0) {
                    return question.find( { 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        questions_on_archive:0,
                        created_by: user_id
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
                        questions_on_archive:0,
                        created_by: user_id
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
                if(_id != 0) {
                    return question.find( { 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        questions_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
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
                        created_by: user_id
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
        }
    },
    getQuestionsByUser = (questions) => {
        try{
        const user_id = decodeToken(req.headers['x-access-token'])._id;
        if(membership_type === 1) {
            return _.filter(questions, (element) => {
                return element.created_by.toString() === user_id.toString();
            });
        }
        else {
            return questions;
        }
    }
    catch(e){
        console.log("error:"+e);
    }
    },
    searchQuestions = (questions) => {
        try {
            
            return _.filter(questions, (element) => {
                var x = new RegExp(_.escapeRegExp(search), "i");
                //console.log("x: " + element.course_id.course_name + " - " + element.assessment_name.match(/search/g));
                return x.test(element.course_id.course_name) || x.test(element.assessment_id.assessment_name) || 
                x.test(element.lesson_id.lesson_name) || x.test(element.question);
            });
        }
        catch(e){console.log(e);
            throw e;
        }
    },
    getPagedQuestions = (questions) => {
        var drop_question = _.drop(questions, (limit * page) - limit);
        var take_question = _.take(drop_question, limit);
        
        return take_question;
    },
    getNumberOfPages = (questions) => {
        return Math.ceil(questions.length / limit);
    },
    mapQuestions = (questions) =>{
        return questions.map(display => {
            const {
                _id, lesson_id, assessment_id, course_id, question,
                answer_key, choices, time_limit, explaination, is_draft
            } = display;

            var status;
            if(is_draft) {
                status = "Draft";
            }
            else {
                status = "Published";
            }

            return {
                _id, lesson_id, assessment_id, course_id, question,
                answer_key, choices, time_limit, explaination, status
            };
        });
    }

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var questions = await getQuestions();
                var questions_by_user = await getQuestionsByUser(questions);
                questions = questions_by_user;
                //console.log(questions);
                if(questions.length > 0) {
                    if(_id == 0) {
                        var search_questions = await searchQuestions(questions);
                        questions = search_questions;
                    }
                    
                    var number_of_pages = getNumberOfPages(questions);
                    var paged_questions = await getPagedQuestions(questions);
                    var map_questions = mapQuestions(paged_questions);
                    res.send(200, {code: "Success", msg : "Questionaire retrieved", number_of_pages, map_questions});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Questionaire not found"}); 
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Questionaire", e});
        }
    }

    main ();
}