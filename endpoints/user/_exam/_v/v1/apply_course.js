
//this api is for create session
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_session = require('../../../../../models/exam_sessions');
const exam_mock_session = require('../../../../../models/exam_mock_session');
const mock_exam = require('../../../../../models/mock_exam');
const course = require('../../../../../models/course');
const questions = require('../../../../../models/questions');
const assessment = require('../../../../../models/assessment');
const lessons = require('../../../../../models/lessons');
const { decodeToken } = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){ 
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    getSession = () =>{
        return exam_session.findOne({user_id:_id})
        .then(data=>{  return data;  })
        .catch(err =>{   throw err  })
    },
    getCourseExist = (session_exist) =>{
    var details = req.body.details
        if(session_exist){
            for(var i=0; i<details.length; i++){
            session_exist.session_details.forEach(s_d=>{
                    if(details[i].course_id.toString() === s_d.course_id.toString() ){
                        details.splice(i, 1)
                    }
                });
        }
       }
    return details
    }
    getQuestion = (course_exist) =>{
        var ids = []
        course_exist.forEach(element => {
            ids.push(element.course_id)
        });
        return questions.find({ course_id : { $in : ids}, is_draft:false, questions_on_archive:false})
        .populate({  path:'assessment_id', select:'assessment_name'  })
        .populate({  path:'course_id',  select:'course_name'   })
        .populate({  path:'lesson_id',  select:'lesson_name'  })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
    },
    grpQuestion = (get_question, compute_expiry) =>{
        var new_list = get_question.map(g_q =>{
            var {course_id,assessment_id, lesson_id , _id } = g_q
            return  new_item ={
                course_id:g_q.course_id,
                assessment_id:g_q.assessment_id,
                lesson_id:g_q.lesson_id,
                question_id:g_q._id,
            }  
        })
        var groups = _.groupBy(new_list, 'lesson_id');
        var result1 = _.map(groups, function(assess){
            return {
               lesson_id: assess[0].lesson_id,
               course_id: assess[0].course_id,
               assessment_id: assess[0].assessment_id,
               no_of_items:assess.length,
               correct_lesson:0,
               incorrect_lesson:0,
               un_answered:assess.length,
               count:assess.length,
               lesson_details: _.map(assess, function(lesson_details){ 
                    return {
                       course_id:lesson_details.course_id,
                       assessment_id:lesson_details.assessment_id,
                       lesson_id:lesson_details.lesson_id,
                       question_id:lesson_details.question_id,
                       count:lesson_details.count
                    }
                })
            }
        });

        var groups2 = _.groupBy(result1, 'assessment_id');
        var result2 = _.map(groups2, function(assess){
            return {
                course_id: assess[0].course_id,
                assessment_id: assess[0].assessment_id,
                no_of_items:0,
                correct_lesson:0,
                incorrect_lesson:0,
                un_answered: 0,
                lessons: _.map(assess, function(lessons){
                    return {
                        course_id:lessons.course_id,
                        assessment_id:lessons.assessment_id,
                        lesson_id:lessons.lesson_id,
                        question_id:lessons.question_id,
                        no_of_items:lessons.no_of_items,
                        correct_lesson:0,
                        incorrect_lesson:0,
                        un_answered:lessons.un_answered,
                        lesson_details:lessons.lesson_details
                    }
                })
            }
        });
        var groups3 = _.groupBy(result2, 'course_id');
        var result3 = _.map(groups3, function(assess){
            return {
                course_id: assess[0].course_id,
                date_registered:new Date(Date.now()),
                date_expiration:"",
                no_of_items:0,
                correct_course:0,
                incorrect_course:0,
                un_answered:0,
                assessment: _.map(assess, function(assessment){
                    return {
                        course_id:assessment.course_id,
                        assessment_id:assessment.assessment_id,
                        lesson_id:assessment.lesson_id,
                        question_id:assessment.question_id,
                        no_of_items:assessment.no_of_items,
                        correct_assess:0,
                        incorrect_assess:0,
                        un_answered:assessment.un_answered,
                        lessons:assessment.lessons
                    }
                })
            }
        });

        var count_c = _(get_question)
        .groupBy('course_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();

        var count_a = _(get_question)
        .groupBy('assessment_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();

        result3.map(reslt =>{
            compute_expiry.map(c_e=>{
                count_c.map(c=>{
                    if(reslt.course_id._id.toString() === c_e.course_id.toString() && c_e.course_id.toString() === c._id.toString()){
                        reslt.date_expiration = c_e.duration
                        var counts = c.count
                        reslt.no_of_items = counts
                        reslt.un_answered = counts
                    }
                })
            })
        });
        result3.map(reslt =>{
            reslt.assessment.map(r_a=>{
                 count_a.map(a=>{
                    if(r_a.assessment_id._id.toString() === a._id.toString() ){
                        var counts = a.count
                        r_a.no_of_items = counts
                        r_a.un_answered = counts
                    }
                })
            })
               
        });
        return result3
    },
    computeExpiryDate = () =>{
        var details = req.body.details;
        details.forEach(det=>{
            var {course_id, duration} = det
             var date_expiration = new Date(Date.now());
            month = date_expiration.getMonth(),
            year = date_expiration.getFullYear();
            convertd_m= parseInt(month);
            convertd_d= parseInt(duration);
            if(duration !== "free"){
            var due = parseInt(duration)
            var new_month = convertd_m + due
                if (new_month >12){
                    var added =  new_month - 13
                    var new_year = year + 1
                    date_expiration.setMonth(added);
                    date_expiration.setFullYear(new_year)
                    det.duration = date_expiration.toISOString() 
                    }  else{
                    date_expiration.setMonth(new_month);
                    det.duration = date_expiration.toISOString()
                }
            }else{  det.duration ="free"; }
        })
       return details
    };
    createSession =(map_data) =>{
        var to_save = {
            user_id:_id,
            session_details:map_data
        }
         new_data = new exam_session(to_save);
        return new_data.save()
        then(data => {  return data;  })
        .catch(err => { throw err; });
    },
    setToupdate = (session_exist,grp_question) =>{ 
        var new_data = session_exist.session_details; 
        var  merged_data = new_data.concat(grp_question); 
          merged_data
       merged_data
       return exam_session.findOneAndUpdate({user_id:_id},{
               $set:{  session_details:merged_data  }
       })
       then(data => {  return data; })
       .catch(err => {  throw err; });
   },
   //// mock exams 
   getMockExam = (course_exist) =>{
      var ids = []
        course_exist.forEach(element => {
            ids.push(element.course_id)
        });
        return mock_exam.find({ course_id : { $in : ids}, 
       //     is_draft:false,
            is_archived:false
        })
        .then(data=>{  return data  })
        .catch(err=>{   throw err   })
    },
    getMockUser = () =>{
        return exam_mock_session.findOne({user_id:_id})
        .then(data=>{  return data   })
        .catch(err=>{  throw err  })
    },
    updateUserMock = (get_mock_exam, get_mock_user,course_exist) =>{
       
        var set_data =[];
        get_mock_exam.forEach(element=>{
            var quest_list = [];
            const {_id, no_of_questions, question_list, total_time, course_id} = element
            question_list.forEach(element2=>{ 
                const {_id, answer_key} = element2
                var quest_id = element2._id
                    quest_list.push({quest_id,answer_key })
            });
            var new_data ={
                course_id:element.course_id,
                mock_no_of_items:quest_list.length,
                mock_un_answered:quest_list.length,
                mock_id:element._id,
                mock_questions:quest_list,
                total_time:total_time
            }
            set_data.push(new_data)
        });
        var groups = _.groupBy(set_data, 'course_id');
        var result1 = _.map(groups, function(mock){
            return {
                course_id: mock[0].course_id,
                is_expired: false,
                mock_details: _.map(mock, function(mock_details){  
                    return {
                        mock_no_of_items:mock_details.mock_no_of_items,
                        mock_un_answered:mock_details.mock_un_answered,
                        mock_id:mock_details.mock_id,
                        mock_questions:mock_details.mock_questions,
                        total_time:mock_details.total_time
                    }
                })
            }
        });

        var new_mock_list = get_mock_user.users_mock;
            result1.forEach(res=>{
                var { course_id} = res
                new_mock_list.push(res)
            });
          
        return exam_mock_session.findOneAndUpdate({user_id:_id},{
            $set:{
                users_mock:new_mock_list
            }
        })
        .then(data=>{
            return data
        })
        .catch(err =>{
            throw err
        })
    },
    saveMock =(get_mock_exam, get_mock_user,course_exist) =>{
        var set_data =[];
        get_mock_exam.forEach(element=>{
            var quest_list = [];
            const {_id, no_of_questions, question_list, total_time, course_id} = element
            question_list.forEach(element2=>{ 
                const {_id, answer_key} = element2
                var quest_id = element2._id
                    quest_list.push({quest_id,answer_key })
            });
            var new_data ={
                course_id:element.course_id,
                mock_no_of_items:quest_list.length,
                mock_un_answered:quest_list.length,
                mock_id:element._id,
                mock_questions:quest_list,
                total_time:total_time
            }
            set_data.push(new_data)
        });
        var groups = _.groupBy(set_data, 'course_id');
        var result1 = _.map(groups, function(mock){
            return {
                course_id: mock[0].course_id,
                mock_details: _.map(mock, function(mock_details){  
                    return {
                        mock_no_of_items:mock_details.mock_no_of_items,
                        mock_un_answered:mock_details.mock_un_answered,
                        mock_id:mock_details.mock_id,
                        mock_questions:mock_details.mock_questions,
                        total_time:mock_details.total_time
                    }
                })
            }
        });
         var set_mock ={
            user_id:_id,
            users_mock:result1
        }
        exam_mock_session.create(set_mock);
    };
    async function main() {
        try {
            var session_exist = await getSession();
            if(session_exist){
                var course_exist = await getCourseExist(session_exist)
                var get_question = await getQuestion(course_exist);
                var compute_expiry = await computeExpiryDate()
                var  grp_question = await grpQuestion(get_question, compute_expiry);
                var update_session = await setToupdate(session_exist,grp_question)

                var get_mock_exam = await getMockExam(course_exist)
                var get_mock_user =await getMockUser()
                var update_mock = await updateUserMock(get_mock_exam, get_mock_user, course_exist)
                res.send(200, {code: "SUCCESS", msg : "New Course is successfully added to your collection",update_mock}); 
            }else{
                var course_exist = await getCourseExist(session_exist)
                var get_question = await getQuestion(course_exist);
                var compute_expiry = await computeExpiryDate()
                var grp_question = await grpQuestion(get_question, compute_expiry);

                var create_session = await createSession(grp_question)

                var get_mock_exam = await getMockExam(course_exist)
                var get_mock_user =await getMockUser()
                var save_mock = await saveMock(get_mock_exam, get_mock_user, course_exist)
                res.send(200, {code: "SUCCESS", msg : "Course is successfully added to your collection", save_mock}); 
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while saving the exam session", e});
        }
    }
    main ();
}