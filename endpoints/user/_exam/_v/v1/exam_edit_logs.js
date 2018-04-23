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
    const {log_id } = req.body
    const
    getSession = () => {
        return exam_logs.findById({_id:log_id})
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
        var exp=[];
        var stat =0;
        exam_sessions.session_details.map(es =>{
            var {question_id,status,explain,answer_key} = es
            get_question.forEach(element => {
                var {_id, question,choices, explaination,answer_key} = element
                if(es.question_id.toString() === req.body._id.toString() ){
                    if(element._id.toString() === req.body._id.toString()){
                        es.answer_key = element.answer_key
                        if(req.body.answer){
                            for(var i =0; i< choices.length; i++){
                            if(choices[i] === req.body.answer){
                                exp.push(explaination[i])
                            }
                            }
                            if(element.answer_key.toString() === req.body.answer.toString()){
                                es.answer = req.body.answer
                                es.status = 1
                                es.answered = 1
                                es.marked = req.body.marked
                                es.explain = exp[0]
                             stat = 1
                            }else{
                                es.answer = req.body.answer
                                es.status = 2
                                es.answered = 1
                                es.marke= req.body.marked
                                stat = 2
                                es.explain = exp[0]
                            }
                        }
                        }else{
                            es.marked = req.body.marked
                        }
                        
                }
            });
           
        });
        
        var explain = exp[0]
        var session_details =  exam_sessions.session_details
        return {session_details,explain,stat  }
    },
    updatelogs = (session_details) =>{

        var right = _(session_details.session_details.filter(session => session.status === 1)).remove(null);
        var wrong = _(session_details.session_details.filter(session => session.status === 2)).remove(null);
        var skipped = _(session_details.session_details.filter(session => session.status === 0)).remove(null);
        right = _(right).size()
        wrong = _(wrong).size()
        skipped =_(skipped).size()
        return exam_logs.findByIdAndUpdate({_id:log_id}, {
                $set:{
                    session_details:session_details.session_details,
                    duration: req.body.time_spent,
                    correct:right,
                    incorrect :wrong,
                    skipped:skipped
                }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var get_question = await getQuestion(exam_sessions)
            var get_user_Log =await getUserLog(exam_sessions,get_question)
            var update_logs = await updatelogs(get_user_Log)
                res.send(200, {code: "Success", msg : "logs successfully fetched"}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}