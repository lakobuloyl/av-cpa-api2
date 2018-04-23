
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_mock_session = require('../../../../../models/exam_mock_session');
const exam_logs = require('../../../../../models/exam_logs');
var _ = require('lodash');
const { decodeToken } = require('../../../../../services/core_services');
module.exports = function(req,res,next){ 
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    
    const
    getSession = () => {
        return exam_mock_session.findOne({user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getSpecific = (exam_sessions) =>{
       exam_sessions.users_mock.map(element => {
            element.mock_details.map(element2 =>{
                var { mock_id,mock_questions } = element2
                mock_questions.map(element3=>{
                    if(element2.mock_id.toString() === req.body.mock_id.toString()){
                        if(element3.quest_id.toString() === req.body.question_id.toString()){
                            if(req.body.command === 0){
                                if(element3.is_flagged === 0){
                                    element3.is_flagged =1 
                                   ++ element2.mock_flagged
                                }
                            }else if(req.body.command === 1){
                                if(element3.is_flagged === 1){
                                    element3.is_flagged = 0  
                                    -- element2.mock_flagged
                                }
                            }
                        }
                    }
                })
            })
        });
        return exam_mock_session.findOneAndUpdate({user_id:_id}, {
                $set:{
                    users_mock:exam_sessions.users_mock
                }
            }
        )
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }, getlogs = () =>{
        return exam_logs.findOne({_id:req.body.log_id})
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updatelogs = (get_logs) =>{
        get_logs.session_details.map(s_d=>{
            if(s_d.quest_id.toString() ===req.body.question_id.toString()){
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
    };
    async function main() {
        try {
            var exam_sessions = await getSession(),
                map_mock = await getSpecific(exam_sessions)
                get_logs = await getlogs()
                update_logs =await updatelogs(get_logs)
                res.send(200, {code: "SUCCESS", msg : "mock question successfully flagged"});
                
      
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}