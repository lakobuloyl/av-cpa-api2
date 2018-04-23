
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
    console.log(req.body)
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
        var c_id =[];
        var m_inc = m_c = skip = flagged =0
        var logs_details = []
       exam_sessions.users_mock.forEach(ms=>{
           var {mock_details, course_id} =ms
            mock_details.forEach(m_d =>{
            var {mock_questions,mock_id, mock_un_answered,mock_incorrect,mock_correct,mock_no_of_items} = m_d
         
            if(m_d.mock_id.toString() === req.body.mock_id.toString()){
                 c_id.push(ms.course_id)
                //m_d.mock_un_answered=0;
                m_d.mock_incorrect=0;
                m_d.mock_correct=0;
            m_d.mock_questions.forEach(m_q=>{
                var {quest_id,answer_key} = m_q
                req.body.result.forEach(reslt =>{
                var {_id ,answer} = reslt
                var l_details = {
                    quest_id:m_q.quest_id,
                    answer:reslt.answer,
                    status:"",
                    is_flagged:0
                }
                    if(m_q.quest_id.toString() === reslt._id.toString()){
                        console.log(reslt.answer)
                       
                        if(reslt.answer){
                            if(reslt.answer.toString() === m_q.answer_key.toString()){ // answer is correct
                                ++m_c
                                m_q.status = 1;
                                l_details.status = 1;
                            }else { // answer is incorrect
                                ++m_inc
                                m_q.status = 2;
                                l_details.status = 2;
                            }
                        }else{
                            ++skip
                            m_q.status = 0;
                            l_details.status = 0;
                        }
                        if(reslt.flag === 1){ // anaswer is flagged
                            ++flagged
                            m_q.is_flagged = reslt.flag;
                            l_details.status = 0;
                        }
                        logs_details.push(l_details);
                    }
                    })
                }) 
             }
            })
       })
        exam_sessions.users_mock.forEach(ms=>{
            var {mock_details} =ms
            mock_details.forEach(m_d =>{
            var {mock_questions,mock_id, mock_un_answered,mock_incorrect,mock_correct,mock_no_of_itemsm,mock_attempts} = m_d
            if(m_d.mock_id.toString() === req.body.mock_id.toString()){
                var attempt = mock_attempts + 1;
                m_d.mock_attempts = attempt
                m_d.mock_questions.forEach(m_q=>{
                    var {quest_id, status, is_flagged} = m_q
                    req.body.result.forEach(reslt =>{
                        var {_id, status, answer } = reslt
                        if(m_q.quest_id.toString() === reslt._id.toString()){
                            m_d.mock_un_answered=skip;
                            m_d.mock_incorrect=m_inc;
                            m_d.mock_correct=m_c;
                            m_d.mock_flagged=flagged;
                        }
                    })
                })
            }
        })
    })
    var total = m_inc+ m_c +skip;
    var answered = m_inc+ m_c;
    var mock_exam_id = req.body.mock_id; 
    var set_logs ={
            exam_mode:"Mock exam",
            user_id:_id,
            exam_name:"Mock exam",
            course_id: c_id[0],
            correct:m_c,
            incorrect:m_inc,
            total: total,
            answered:answered,
            skipped:skip,
            flagged:flagged,
            progress:((m_inc+m_c)/total)*100,
            session_details:logs_details,
            duration:req.body.time_spent,
            mock_exam_id: mock_exam_id
        }
      return {exam_sessions,set_logs } 
    },
    recordResult = (map_mock) =>{
        return exam_mock_session.findOneAndUpdate({user_id:_id}, {
                $set:{
                    users_mock:map_mock.exam_sessions.users_mock
                }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    recordLogs = (map_mock) =>{
       return exam_logs.create(map_mock.set_logs)
    };
    async function main() {
        try {
            var exam_sessions = await getSession(),
                map_mock = await getSpecific(exam_sessions),
                recod_logs = await recordLogs(map_mock)
                id_log = recod_logs._id
            var  record_result = await recordResult(map_mock);

                res.send(200, {code: "SUCCESS", msg : "mock exam feteched", id_log});
                
      
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}