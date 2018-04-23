
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_logs = require('../../../../../models/exam_logs');
const mock_exam = require('../../../../../models/mock_exam');
var _ = require('lodash');
const { decodeToken } = require('../../../../../services/core_services');
module.exports = function(req,res,next){ 
   
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);

    const
    getSession = () => {
        return exam_logs.findById({_id:req.body.log_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getMockExam = (exam_sessions) =>{
        var course_id = exam_sessions.course_id;
        return mock_exam.find({_id:req.body.mock_id, course_id:course_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapSummary = (get_mockxeam, exam_sessions) =>{
        var  mock_name= [];
        var  log_date= exam_sessions.exam_date;
        var summary = [];
        var unans = check = wrong = 0;
        exam_sessions.session_details.forEach(element2=>{
                var {quest_id, answer, status,is_flagged} = element2
                get_mockxeam.forEach(element3 =>{
                var  {question_list,mock_exam_name} = element3
                element3.question_list.forEach(element4 =>{
                        var {_id, question, choices, answer_key, choices, explaination,is_flagged} = element4
                        if(element2.quest_id.toString() === element4._id.toString()){
                            mock_name.push(element3.mock_exam_name)
                           var explain = ""
                            if( element2.answer){
                                for(var i =0; i< element4.choices.length; i++){
                                    if(element4.choices[i] === element2.answer){
                                        explain = explaination[i]
                                    }
                                }
                            }else{
                                explain ="";
                            }
                            
                            if(element2.answer === undefined){
                                element2.answer = "No Answer";
                            }
                            if(element2.status === 1){   ++check; }
                            else if(element2.status === 2) {++wrong; }
                            else if(element2.status === 0){++unans;}
                            var set_data = {
                                _id:element4._id,
                                question:element4.question,
                                choices:element4.choices,
                                answer_key:element4.answer_key,
                                answer:element2.answer,
                                status:element2.status,
                                explain : explain,
                                is_flagged:element2.is_flagged
                            }
                            summary.push(set_data)
                        }
                    })
                });
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
            var get_mockxeam = await getMockExam(exam_sessions);
            var map_summary = await mapSummary(get_mockxeam, exam_sessions)
                res.send(200, {code: "SUCCESS", msg : "mock exam fetched", map_summary});
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}