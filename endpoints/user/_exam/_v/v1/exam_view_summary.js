

//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_logs = require('../../../../../models/exam_logs');
const questions = require('../../../../../models/questions');
var _ = require('lodash');
const { decodeToken } = require('../../../../../services/core_services');
module.exports = function(req,res,next){ 
   
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getSession = () => {
        return exam_logs.findById({_id:req.params.log_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestions = (exam_sessions) =>{
        return questions.find({is_draft:0, course_id:exam_sessions.course_id })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapSummary = (get_questions, exam_sessions) =>{
        var  mock_name= [];
        var explain = ""
        var  log_date= exam_sessions.exam_date;
        var summary = [];
        var unans = check = wrong = 0;
        exam_sessions.session_details.forEach(element2=>{
                var {question_id, answer, status} = element2
                get_questions.forEach(element3 =>{
                    var {_id, choices, explaination, answer_key} =element3
                    if(element2.question_id.toString() === element3._id.toString()){
                        if(element2.answer === ""){
                               explain ="";
                            }else{
                                 for(var i =0; i< element3.choices.length; i++){
                                    if(element3.choices[i] === element2.answer){
                                        explain = explaination[i]
                                    }
                                }
                            }
                            
                            if(element2.answer === undefined){
                                element2.answer = "No Answer";
                            }
                            if(element2.status === 1){   ++check; }
                            else if(element2.status === 2) {++wrong; }
                            else if(element2.status === 0){++unans;}
                            var set_data = {
                                question:element3.question,
                                choices:element3.choices,
                                answer_key:element3.answer_key,
                                answer:element2.answer,
                                status:element2.status,
                                explain : explain
                            }
                            summary.push(set_data)
                    }
                            
                    })
            });
        var course_id =exam_sessions.course_id
        var mock_exam_name = mock_name[0]
        var total = unans + check+ wrong;
        var summary_result={
            correct:check,
            incorrect: wrong,
            unanswered: unans,
            total:total
        }
        return {summary, summary_result, mock_exam_name, log_date, course_id}
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var get_questions = await getQuestions(exam_sessions);
            var map_summary = await mapSummary(get_questions, exam_sessions)
                res.send(200, {code: "SUCCESS", msg : "summary exam fetched", map_summary});
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}