
//this api is for create session
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_mock_session = require('../../../../../models/exam_mock_session');
const mock_exam = require('../../../../../models/mock_exam');
const { decodeToken } = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){ 
    const
    ///////// for mock exam
    getMockExam = () =>{
        return mock_exam.find({course_id:req.params.course_id})
        .then(data=>{
            return data
        })
        .catch(err=>{
            throw err
        })
    },
    getMockUser = () =>{
        return exam_mock_session.find()
        .then(data=>{
            return data
        })
        .catch(err=>{
            throw err
        })
    },
    updateUserMock = (user_mock,get_mock) =>{
        var set_data =[];
        get_mock.forEach(element=>{
            var quest_list = [];
            const {_id, no_of_questions, question_list} = element
            question_list.forEach(element2=>{ 
                const {_id} = element2
                var quest_id = element2._id
                    quest_list.push({quest_id})
            });
            var new_data ={
                mock_no_of_items:element.question_list.length,
                mock_un_answered:0,
                mock_incorrect:0,
                mock_flagged:0,
                mock_correct:0,
                mock_id:element._id,
                mock_questions:quest_list
            }
            set_data.push(new_data)
        });
        user_mock.forEach(element => {
            var {users_mock, user_id} = element;
            users_mock.forEach(element2 =>{
                var {course_id, mock_details} = element2;
                mock_details.forEach(element3 =>{
                    var {mock_id, mock_no_of_items, mock_un_answered, mock_questions, mock_flagged, mock_incorrect, mock_correct} = element3
                    mock_questions.forEach(element4=>{
                        var {quest_id, status ,is_flagged} = element4;
                        set_data.forEach(g_m =>{
                            var {mock_id, mock_no_of_items, mock_un_answered, mock_questions, mock_flagged, mock_incorrect, mock_correct} = g_m
                            mock_questions.forEach(m_q=>{ 
                                const {quest_id, is_flagged, status} = m_q
                                if(element2.course_id.toString() === req.params.course_id.toString()){
                                    if(element3.mock_id.toString() === g_m.mock_id.toString()){
                                        if(element4.quest_id.toString() === m_q.quest_id.toString() ){
                                            m_q.status = element4.status
                                            g_m.is_flagged = element4.is_flagged
                                            if(m_q.status === 1){ ++g_m.mock_correct }
                                            else if(m_q.status === 2){  ++g_m.mock_incorrect }
                                            else if(m_q.status === 0){  ++g_m.mock_un_answered; }
                                            if(m_q.is_flagged === 1){  ++g_m.mock_flagged }
                                        }
                                    }
                                }
                            });  
                        });
                    });
                    if(element2.course_id.toString() === req.params.toString()){
                          element2.mock_details =set_data;
                    }
                });
            });
            return exam_mock_session.findOneAndUpdate({user_id: element.user_id},{
                $set:{  users_mock:element.users_mock } })
            .then(data =>{
                return data;
            })
            .catch(err=>{
                throw err;
            })
        });
    };
    async function main() {
        try {
            var get_mock = await getMockExam();
            var user_mock = await getMockUser();
            var update_mock = await updateUserMock(user_mock,get_mock);
            res.send(200, {code: "Success", msg : "success sync session",update_mock});
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while synching the exam session", e});
        }
    }
    main ();
}