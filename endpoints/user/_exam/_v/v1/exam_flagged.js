//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions');
const exam_logs = require('../../../../../models/exam_logs');
const { decodeToken} = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){  

    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const

    getSessions = () =>{
        return exam_sessions.findOne({user_id:_id})
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getlogs = () =>{
        return exam_logs.findOne({_id:req.body.log_id})
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updatelogs = (get_logs) =>{
        get_logs.session_details.map(s_d=>{
            if(s_d.question_id.toString() ===req.body.question_id.toString()){
                if(req.body.command === 0 ){
                      if( s_d.is_flagged === 0){
                        s_d.is_flagged = 1
                        ++get_logs.flagged 
                    }
                }else if(req.body.command === 1 ){
                    if( s_d.is_flagged === 1){
                        s_d.is_flagged = 0
                        --get_logs.flagged 
                    }
                }
            }
        })

        return exam_logs.findOneAndUpdate({_id:req.body.log_id, user_id:_id},
            {
                $set:{
                    session_details:get_logs.session_details,
                    flagged : get_logs.flagged 
                }
            }
        )
            .then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    }
    flaggedQuestion = (get_sessions) =>{
        var new_session = get_sessions.session_details
        new_session.forEach(element => {
        var {assessment,flagged_course} = element
        assessment.forEach(element2 =>{
            var {lessons,flagged_assess} = element2 
            lessons.forEach(element3 =>{
                var {lesson_details,flagged_lesson} = element3
                lesson_details.forEach(element4 =>{
                    var {question_id, is_flagged} = element4
                        if(req.body.question_id.toString() === element4.question_id.toString()){
                            if(req.body.command === 0){
                                if(element4.is_flagged === 0){
                                    element4.is_flagged = 1
                                    ++element.flagged_course
                                    ++element2.flagged_assess 
                                    ++element3.flagged_lesson 
                                }
                                
                            }else if(req.body.command === 1){
                                if(element4.is_flagged === 1){
                                    element4.is_flagged = 0
                                    --element.flagged_course
                                    --element2.flagged_assess 
                                    --element3.flagged_lesson 
                                }
                            }
                            
                        }     
                }); // element 4
            }); // element 3
        }); /// element 2
    }); /// element

    return new_session
    },
    updateSession = (flagged_question) =>{
        return exam_sessions.findOneAndUpdate({user_id:_id},
            {
                $set:{
                    session_details:flagged_question,
                }
            }
        )
            .then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    async function main() {
        try {
            var get_sessions = await getSessions();
            var flagged_question = await flaggedQuestion(get_sessions);
            var get_logs = await getlogs();
            var update_logs = await updatelogs(get_logs)
            var update_session = await updateSession(flagged_question)
                res.send(200, {code: "Success", msg : "question flagged successfully"}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}