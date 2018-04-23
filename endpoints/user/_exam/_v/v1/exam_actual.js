//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions');
const exam_logs = require('../../../../../models/exam_logs');
const questions = require('../../../../../models/questions');
const { decodeToken } = require('../../../../../services/core_services');
const _ = require('lodash')

module.exports = function(req,res,next){  
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const
    findSession = () =>{
        return exam_sessions.findOne({user_id:_id })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestion =() =>{
        return exam_logs.findById({_id:req.body.log_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    logUpdate =() =>{
        return exam_logs.findByIdAndUpdate({_id:req.body.log_id},
            {
                $set:{
                    is_done: 1
            }}
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    comapaAnswer = (session, get_questions) =>{   
        var new_session = session.session_details
            new_session.forEach(element => {
            var {assessment, course_id,no_of_items,correct_course,incorrect_course,un_answered, flagged_course} = element
            assessment.forEach(element2 =>{
                const {lessons,no_of_items,correct_assess,incorrect_assess,un_answered, flagged_assess} = element2 
                lessons.forEach(element3 =>{
                    var {lesson_details,no_of_items,correct_lesson,incorrect_lessons,un_answered, flagged_lesson} = element3
                    lesson_details.forEach(element4 =>{
                        var {question_id,status,is_flagged} = element4
                            if(element.course_id.toString() === course_id.toString()){
                                get_questions.session_details.forEach(s_d=>{
                                        var {question_id, status, is_flagged} = s_d
                                        if(s_d.question_id.toString() === element4.question_id.toString()){
                                          element4.status = s_d.status

                                          element.correct_course =0;
                                          element.incorrect_course =0;
                                          element.un_answered = element.no_of_items;
                                          element.flagged_course =0;
                                          
                                          element2.correct_assess =0;
                                          element2.incorrect_assess =0;
                                          element2.un_answered = element2.no_of_items;
                                          element2.flagged_assess =0;
      
                                          element3.correct_lesson =0;
                                          element3.incorrect_lessons =0;
                                          element3.un_answered = element3.no_of_items;
                                          element3.flagged_lesson =0;

                                          element4.is_flagged = s_d.is_flagged
                                        }
                                    });
                                   
                                }                           
                            
                    }); // element 4
                }); // element 3
            }); /// element 2
        }); /// element
            new_session.forEach(element => {
                var {assessment, course_id,no_of_items,correct_course,incorrect_course,un_answered, flagged_course} = element
                assessment.forEach(element2 =>{
                    const {lessons,no_of_items,correct_assess,incorrect_assess,un_answered, flagged_assess} = element2 
                    lessons.forEach(element3 =>{
                        var {lesson_details,no_of_items,correct_lesson,incorrect_lessons,un_answered, flagged_lesson} = element3
                    lesson_details.forEach(element4 =>{
                        var {question_id,status,is_flagged} = element4
                        get_questions.session_details.forEach(s_d=>{
                                var {question_id} = s_d
                            if(element4.question_id.toString() === s_d.question_id.toString()){
                                if(element4.status === 1){
                                    ++ element.correct_course
                                    ++ element2.correct_assess
                                    ++ element3.correct_lesson

                                    -- element.un_answered
                                    --element2.un_answered
                                    -- element3.un_answered
                                }
                                else if(element4.status ===2){
                                    ++ element.incorrect_course
                                    ++ element2.incorrect_assess
                                    ++ element3.incorrect_lessons

                                    -- element.un_answered
                                    --element2.un_answered
                                    -- element3.un_answered
                                }
                                if(element4.is_flagged === 1){
                                    ++ element.flagged_course
                                    ++ element2.flagged_assess
                                    ++ element3.flagged_lesson
                                }
                            }
                        })
                    }); // element 4
                }); // element 3
            }); /// element 2
        }); /// element
       
        return session
     },
    saveData = (update) =>{
        return exam_sessions.findOneAndUpdate({user_id:_id},
        {
            $set:{
                session_details:update
            }
        }
    )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    findQuestions = (get_questions)=>{
        return questions.find({course_id:get_questions.course_id})
        then(data=>{
            return data;
        })
        .catch(err =>{
            return err;
        })
    },
    questionSummary =(find_questions,session_details) =>{
    //    var set_summary =[];
    //    find_questions.forEach(element =>{
    //         const {_id,question,choices, answer_key,question_type} = element
    //         session_details.forEach(element2 =>{
    //             const {_id, answer, status} = element2
               
    //             if(element._id.toString() === element2._id.toString()){
    //                 var set_data ={
    //                     _id:element._id,
    //                     question:element.question,
    //                     choices:element.choices,
    //                     answer:element2.answer,
    //                     answer_key:element.answer_key,
    //                     question_type:element.question_type,
    //                     status:element2.status
    //                 }
    //                 set_summary.push(set_data);
    //             }
    //         });
    //    });
    //    return set_summary
    },
    percentage =(get_questions) =>{
        
        var right = _(get_questions.session_details.filter(session => session.status === 1)).remove(null);
        var wrong = _(get_questions.session_details.filter(session => session.status === 2)).remove(null);

        var no_of_items = _(get_questions.session_details).size();
        return { no_of_items, 
            right : _(right).size(),
            wrong : _(wrong).size()}
    },
    sendSuccess = (res, data, msg) => {
        res.send(200, {
            data,
            msg,
        });
    };
    async function main() {
        try {
             // if(membership_type === 2)
            // {
                var session = await findSession();
                var get_questions = await getQuestion()
                var compare_answer = await comapaAnswer(session,get_questions); // get and compare answer
                var update = compare_answer.session_details;
                var save_data = await saveData(update);
                var find_questions = await findQuestions(get_questions);
                var summary = await questionSummary(find_questions)
                var prnctge = await  percentage(get_questions);
                var log = await  logUpdate();
                sendSuccess(
                    res,
                    { 
                       // summary,
                        prnctge
                    },
                    "summary fetched!"
                );
             // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // }    
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while recording answer", e});
        }
    }

    main ();
}