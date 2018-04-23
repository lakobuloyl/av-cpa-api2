//this api is for editing of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions.js');
const questions = require('../../../../../models/questions.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
var _ = require('lodash');

module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const question_id = req.params._id;

    const
    getQuestions = () => {
        return questions.findOne({
            _id: question_id,
            questions_on_archive: 0
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getExamSessions = () => {
        return exam_sessions.find({})
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateQuestions = (questions) => {
        Object.keys(req.body).
        forEach(key => {
            questions[key] = req.body[key];
        });
    return  questions;
    },
    saveQuestions = (questions) => {
        return questions.save().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    checkIfUsed = (sessions, c_id) => {
        var map_sessions = _.map(sessions, (element) => {
            var is_used = 0;
            //console.log(" === " + c_id.toString());
            _.forEach(element.session_details, (element2) => {
                //console.log(element2.course_id.toString() + " === " + c_id.toString());
                if(element2.course_id.toString() === c_id.toString()) {
                    is_used = 1;
                }
            });

            return is_used;
        });

        //console.log("before: " + map_sessions);
        _.remove(map_sessions, (element) => {
            return element === 0;
        });
        //console.log("after: " + map_sessions);

        return map_sessions.length;
    };
    
    async function main() {

        try {
            if(membership_type === 0 || membership_type === 1)
            {
                var questions = await getQuestions();
                if(questions !== null) {
                    var exam_session = await getExamSessions();

                    if(questions.is_draft == false) { //IF PUBLISHED YUNG LESSON TO BE EDITED
                        var is_used = await checkIfUsed(exam_session, questions.course_id);

                        if(is_used > 0) {
                            res.send(403, {code: "FORBIDDEN", msg : "Question cannot be edited"});
                        }
                        else {
                            var question_update = await updateQuestions(questions);
                            var new_question = await saveQuestions(question_update);
                            res.send(200, {code: "Success", msg : "Question successfully updated", new_question});
                        }
                    }
                    else { //IF DRAFT YUNG LESSON TO BE EDITED
                        if(req.body.is_draft === 0 && membership_type === 1) {
                            res.send(403, {code: "FORBIDDEN", msg : "Question cannot be edited"});
                        }
                        else {
                            var question_update = await updateQuestions(questions);
                            var new_question = await saveQuestions(question_update);
                            res.send(200, {code: "Success", msg : "Question successfully updated", new_question});
                        }
                    }                    
                }
                else
                {
                    res.send(404, {code: "NOT FOUND", msg : "Question not found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating question", e});
        }
    }

    main ();
}