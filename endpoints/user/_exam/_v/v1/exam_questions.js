
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_session = require('../../../../../models/exam_sessions');
const exam_logs = require('../../../../../models/exam_logs');
const questions = require('../../../../../models/questions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
var shuffle = require('shuffle-array');
var _ = require('lodash')
module.exports = function(req,res,next){  

    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const {session_id,status,course_id,assess_ids,less_ids, limit, no_of_items} =req.body;
    const
    getQuestId = () => {
        return exam_session.findOne({user_id:_id},{
            session_details:{
                $elemMatch:{
                    course_id:course_id
                }
            }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapData = (get_quest_id) =>{
        var correct = [];
        var incorrect = [];
        var unanswered = [];
        var flagged = [];
        get_quest_id.session_details.forEach(element =>{
            const {assessment} = element
            assessment.forEach(element2 =>{
                const {lessons, assessment_id} = element2
                lessons.forEach(element3 =>{
                    const{ lesson_details, lesson_id} = element3
                    lesson_details.forEach(element4 =>{
                        const {question_id,status,is_flagged} = element4
                            var set_data = {
                                question_id:question_id,
                                answer:"",
                                status:0,
                                is_flagged:is_flagged,
                                marked:0,
                                explain:"NaN",
                                answer_key:"",
                            }
                            ////// compare lesson_id from the body the lesson_of user's session-
                            less_ids.forEach(l_i =>{
                                const {less_id} = l_i 
                                    if(element3.lesson_id.toString() === less_id.toString()){
                                      
                                        if(status ===0){
                                            unanswered.push(set_data)  
                                        }
                                        else if(status ===1){
                                                correct.push(set_data)
                                        }
                                        else if(status ===2){
                                            incorrect.push(set_data)
                                        }
                                       
                                        if(is_flagged  === 1){
                                        flagged.push(set_data)
                                        }
                                    }
                            })
                    });
                });
            }); 
        });
        var question_set = []
        for(var i =0; i<status.length ; i++){
            if(status[i] === 1){
                question_set.push(correct)
            } else if(status[i] ===2){
                question_set.push(incorrect)
            }else if(status[i] ===3){
                question_set.push(unanswered)
            }else if(status[i] ===4){
                question_set.push(flagged)
            }
        }
       
       var flatten_data = _.flatten(question_set)
        if(flatten_data.length>= no_of_items){
            return flatten_data
        }
        else {
            return []
        }
    },
    getQuestion = () => {
        return questions.find({is_draft:0, course_id:course_id })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mergedQuestions = (get_question,map_data) =>{
        var quest_array =[];
        get_question.forEach(element => {
            const {_id,  question, choices,  answer_key,  explaination} = element
            map_data.forEach(element2 =>{
                const{question_id} = element2
                if(question_id.toString() === element._id.toString()){
                    var to_set= { 
                        _id:_id,
                        marked:0,
                        answered:0,  
                        question:question, 
                        choices:choices,   
                        explaination:explaination,
                    }
                        quest_array.push(to_set)
                }
            });
        });
        quest_array.splice(no_of_items)
        return quest_array
    },
    examLogs = (map_data) =>{
       
        
        map_data.splice(no_of_items)
        var  mode = ""
        if(req.body.exam_mode === 1){
            mode= "Study Mode"
        }
        else if(req.body.exam_mode === 2){
            mode = "Actual Exam"
        }

        console.log(map_data);
        var  flg = 0;
         map_data.forEach(m_d=>{

             if(m_d.is_flagged === 1){
                 ++flg
             }
         });
         console.log(flg);

        var session = Object.assign({
            exam_mode:mode,
            user_id:_id,
            exam_name:mode,
            course_id:req.body.course_id, 
            total:map_data.length, 
            session_details:map_data,
            duration:req.body.duration,
            skipped:map_data.length,
            flagged: flg
        })
        return exam_logs.create(session)
    },
    sendSuccess = (res, data, msg) => {
        res.send(200, {
            data,
            msg,
        });
    };
    async function main() {
        try {
                var get_quest_id = await getQuestId();
                if(get_quest_id){
                    var map_data = await mapData(get_quest_id)
                    var get_question = await getQuestion();
                    if(map_data.length > 0){
                        var merge_questions = await mergedQuestions(get_question,map_data);
                        var shuffled = await shuffle(merge_questions)
                        var exam_logs_data = await examLogs(map_data)
                        var id =  exam_logs_data._id
                        sendSuccess(
                            res,
                            { 
                                exam_mode :req.body.exam_mode,
                                id
                            },
                            "Questionaire retrieved"
                        );
                    }else{ res.send(404, {code: "NOT FOUND", msg : "No questions matched your filters"});  }
                }
                else{  res.send(404, {code: "NOT FOUND", msg : "Questionaire not found"});  }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Questionaire", e});
        }
    }

    main ();
}