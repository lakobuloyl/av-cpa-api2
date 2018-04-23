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
    const {course_id,session_details} =req.body;
    const {log_id} = req.params
    const
    findSession = () =>{
        return exam_sessions.findOne({user_id:_id })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    comapaAnswer = (session,user_answer) =>{   
        var e_logs = {
            user_id:_id,
            course_id:course_id,
            correct:0,
            incorrect:0,
            total:0,
            answered:0,
            progress:0,
            session_details:[]
        }
        var new_session = session.session_details
            new_session.forEach(element => {
            var {assessment, course_id,no_of_items,correct_course,incorrect_course,un_answered} = element
            assessment.forEach(element2 =>{
                const {lessons,no_of_items,correct_assess,incorrect_assess,un_answered} = element2 
                lessons.forEach(element3 =>{
                    var {lesson_details,no_of_items,correct_lesson,incorrect_lessons,un_answered} = element3
                    lesson_details.forEach(element4 =>{
                        var {question_id,status} = element4
                        session_details.forEach(element5 =>{
                            var {_id, status, answer} = element5
                            if(element.course_id.toString() === course_id.toString()){
                                if(question_id.toString() === _id.toString()){

                                    element.correct_course =0
                                    element.incorrect_course =0
                                    element.un_answered = element.no_of_items
                                    
                                    element2.correct_assess =0
                                    element2.incorrect_assess =0
                                    element2.un_answered = element2.no_of_items

                                    element3.correct_lesson =0
                                    element3.incorrect_lessons =0
                                    element3.un_answered = element3.no_of_items

                                    ++e_logs.total
                                    e_logs.session_details.push(element5)
                                    element4.status = element5.status
                                }                           
                            }
                        });
                    }); // element 4
                }); // element 3
            }); /// element 2
        }); /// element
            new_session.forEach(element => {
            var {assessment, course_id,no_of_items,correct_course,incorrect_course,un_answered} = element
            assessment.forEach(element2 =>{
                const {lessons,no_of_items,correct_assess,incorrect_assess,un_answered} = element2 
                lessons.forEach(element3 =>{
                    var {lesson_details,no_of_items,correct_lesson,incorrect_lessons,un_answered} = element3
                    lesson_details.forEach(element4 =>{
                        var {question_id,status} = element4
                        session_details.forEach(element5 =>{
                            var {_id, status , answered} = element5
                            if(element4.question_id.toString() === _id.toString()){
                                element5.answered = 1
                                if(element4.status === 1){
                                    ++ element.correct_course
                                    ++ element2.correct_assess
                                    ++ element3.correct_lesson

                                    -- element.un_answered
                                    --element2.un_answered
                                    -- element3.un_answered
                                    ++e_logs.correct
                                }
                                else if(element4.status ===2){
                                    ++ element.incorrect_course
                                    ++ element2.incorrect_assess
                                    ++ element3.incorrect_lessons

                                    -- element.un_answered
                                    --element2.un_answered
                                    -- element3.un_answered
                                    ++e_logs.incorrect
                                }
                            }
                        })
                    }); // element 4
                }); // element 3
            }); /// element 2
        }); /// element
       var data_add= Math.abs(e_logs.correct+e_logs.incorrect)
        var new_e_logs = {
            user_id:e_logs.user_id,
            course_id:e_logs.course_id,
            correct:e_logs.correct,
            incorrect:e_logs.incorrect,
            total:e_logs.total,
            answered:data_add,
            progress:Math.round((Math.abs((e_logs.correct+e_logs.incorrect))/e_logs.total)*100),
            session_details:e_logs.session_details
        }
        return {session,new_e_logs}
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
    findQuestions = ()=>{
        return questions.find({course_id:course_id})
        then(data=>{
            return data;
        })
        .catch(err =>{
            return err;
        })
    },
    questionSummary =(find_questions,session_details) =>{
       var set_summary =[];
       find_questions.forEach(element =>{
            const {_id,question,choices, answer_key} = element
            session_details.forEach(element2 =>{
                const {_id, answer, status} = element2
               
                if(element._id.toString() === element2._id.toString()){
                    var set_data ={
                        _id:element._id,
                        question:element.question,
                        choices:element.choices,
                        answer:element2.answer,
                        answer_key:element.answer_key,
                        status:element2.status
                    }
                    set_summary.push(set_data);
                }
            });
       });
       return set_summary
    },
    saveLogs = (update_logs) =>{
        return exam_logs.findOneAndUpdate({_id:log_id,user_id:_id},
            {
                $set:{
                    correct:update_logs.correct,
                    incorrect:update_logs.incorrect,
                    total:update_logs.total,
                    answered:update_logs.answered,
                    progress:update_logs.progress,
                    session_details:update_logs.session_details,
                }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    percentage =(session_details) =>{
        var right = _(session_details.filter(session => session.status === 1)).remove(null);
        var wrong = _(session_details.filter(session => session.status === 2)).remove(null);

        var no_of_items = _(session_details).size();
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
                var compare_answer = await comapaAnswer(session); // get and compare answer
                var update = compare_answer.session.session_details;
                var save_data = await saveData(update);
                var find_questions = await findQuestions();
                var update_logs = compare_answer.new_e_logs;
                var save_logs =await saveLogs(update_logs);
                var summary = await questionSummary(find_questions,session_details);
                var prnctge = await  percentage(session_details);
                sendSuccess(
                    res,
                    { 
                        summary,
                        prnctge
                    },
                    "summery fetched!"
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