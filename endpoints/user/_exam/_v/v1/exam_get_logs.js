//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_logs = require('../../../../../models/exam_logs');
const questions = require('../../../../../models/questions');
const { decodeToken} = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){  

    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const user_id=_id;
    const
    getSession = () => {
        return exam_logs.findById({_id:req.params.log_id})
        .populate({
            path:'course_id',
            select:'course_name'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestion =(exam_sessions) =>{
        return questions.find({is_draft:0, course_id:exam_sessions.course_id._id })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getUserLog = (exam_sessions,get_question) =>{
        var quest_array = []
        
        exam_sessions.session_details.map(es =>{
            var {question_id,is_flagged,status,answer, explain,answer_key} = es
            get_question.forEach(element => {
                var {_id,question, choices} = element
                if(es.question_id.toString() === element._id.toString()){
                    var set_data = {
                        _id:element._id,
                        question:element.question,
                        choices:element.choices,
                        is_flagged:es.is_flagged,
                        status:es.status,
                        marked:es.marked,
                        answer:es.answer,
                        explain:es.explain,
                        answer_key:answer_key
                    }
                    if(req.body.status === 0){
                        quest_array.push(set_data);
                    }else if(req.body.status === 1){
                        if(set_data.status === 0){
                                quest_array.push(set_data)
                        }
                    }else if(req.body.status === 2){
                        if(set_data.marked === 1){
                                quest_array.push(set_data)
                        }

                    }
                }
            });
        });
        return quest_array
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var get_question = await getQuestion(exam_sessions)
            var get_user_Log =await getUserLog(exam_sessions,get_question)
            var exam_mode = 2;
            if("Study Mode" === exam_sessions.exam_mode){exam_mode =1 }
            var grade = ((exam_sessions.correct/exam_sessions.total)*100);
            var res_data = {
                exam_date:exam_sessions.exam_date,
                statistics:{
                    total:exam_sessions.total,
                    correct:exam_sessions.correct,
                    incorrect:exam_sessions.incorrect,
                    unanswered:exam_sessions.skipped
                },
                course_id:exam_sessions.course_id,
                exam_name:exam_sessions.exam_mode,
                exam_mode:exam_mode,
                quest_array:get_user_Log,
                time_spent:exam_sessions.duration,
                grade:grade
            }
                res.send(200, {code: "Success", msg : "logs successfully fetched",res_data}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}