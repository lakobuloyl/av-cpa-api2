
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
    const {course_details,duration, course_id} = req.body
    var c_id = course_id.toString()
    const user_id =_id
    const
    findSession = () =>{
        return exam_session.findOne({user_id:user_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    findCourse = (if_exist) =>{
            var if_true
            if_exist.session_details.forEach(element =>{
                if(element.course_id.toString() === c_id){
                    if_true = 1
                }  else{   if_true = 0  }
            });
            return if_true
    },
    findQuestions = () =>{
        return questions.find({is_draft:0,questions_on_archive:0})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
    },
    getQuestions = () =>{
        return questions.find({is_draft:0,questions_on_archive:0})
        .populate({  path:'assessment_id', select:'assessment_name'  })
        .populate({  path:'course_id',  select:'course_name'   })
        .populate({  path:'lesson_id',  select:'lesson_name'  })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
    },
    ////////////////////////////////  counting functions
    getQuestionPerLesson = (find_questions) =>{
        var result = _(find_questions)
        .groupBy('lesson_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        return result;
    },
    getQuestionPerAssessment = (find_questions) =>{
        var result = _(find_questions)
        .groupBy('assessment_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        return result;
    },
    getQuestionPerCourse = (find_questions) => {
        var result = _(find_questions)
        .groupBy('course_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        
    },
    getLesson = (find_questions,cnt_a) => {
        var questions_array = [];
        find_questions.forEach(element => {
           const { _id,  lesson_id,course_id ,assessment_id } = element;
                cnt_a.forEach(element2=>{
                    const {_id, count} = element2
                     if(element.course_id.toString() === req.body.course_id.toString()) {
                        if(element2._id.toString() === element.assessment_id.toString()){
                            var new_item ={
                                course_id:element.course_id,
                                assessment_id:element.assessment_id,
                                lesson_id:element.lesson_id,
                                question_id:element._id,
                                count:count
                            }  
                            questions_array.push(new_item)  
                        }
                    }   
                })
        });
         var groups = _.groupBy(questions_array, 'lesson_id');
         var result = _.map(groups, function(assess){
             return {
                lesson_id: assess[0].lesson_id,
                course_id: assess[0].course_id,
                assessment_id: assess[0].assessment_id,
                no_of_items:assess.length,
                correct_lesson:0,
                incorrect_lesson:0,
                un_answered:assess.length,
                count:assess[0].count,
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
       
         return result
    },
      computeExpiryDate = () =>{
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
                var new_date = date_expiration.toISOString()
                        return new_date;
            }  else{
                date_expiration.setMonth(new_month);
                var new_date = date_expiration.toISOString()
                        return new_date;
            }
        }    else{
            var free ="free";
            return free
        }
    },
    mapData = (get_lessons,exp_date, cnt_c) =>{
        var groups = _.groupBy(get_lessons, 'assessment_id');
        var result = _.map(groups, function(assess){
            return {
                course_id: assess[0].course_id,
                assessment_id: assess[0].assessment_id,
                no_of_items:assess[0].count,
                correct_lesson:0,
                incorrect_lesson:0,
                un_answered: assess[0].count,
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
        var groups2 = _.groupBy(result, 'course_id');
        var result2 = _.map(groups2, function(assess){
            return {
                course_id: assess[0].course_id,
                date_registered:new Date(Date.now()),
                date_expiration:exp_date,
                no_of_items:cnt_c,
                correct_course:0,
                incorrect_course:0,
                un_answered:cnt_c,
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
        return result2
    },
    dataSave =(map_data) =>{
        var to_save = {
            user_id:user_id,
            session_details:map_data
        }
        return new_data = new exam_session(to_save)
    }
    saveData = (to_be_save) => {
        return to_be_save.save()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }
    setToupdate = (if_exist,map_data) =>{ 
         var new_data = if_exist.session_details; 
         var  merged_data = new_data.concat(map_data); 
          return merged_data
    }
    updateData = (to_update) =>{
        return exam_session.findOneAndUpdate({user_id:user_id},{
                $set:{  session_details:to_update  }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    ///////// for mock exam
    getMockExam = () =>{
        return mock_exam.find({course_id:c_id})
        .then(data=>{
            return data
        })
        .catch(err=>{
            throw err
        })
    },
    getMockUser = () =>{
        return exam_mock_session.findOne({user_id:_id})
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
                mock_no_of_items:quest_list.length,
                mock_un_answered:quest_list.length,
                mock_id:element._id,
                mock_questions:quest_list
            }
            set_data.push(new_data)
        });
        var new_set = {
            course_id:c_id,
            mock_details:set_data
        }
        var new_mock_list = user_mock.users_mock;
            new_mock_list.push(new_set)
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
    saveMock =(get_mock) =>{
        var set_data =[];
        get_mock.forEach(element=>{
            var quest_list = [];
            const {_id, no_of_questions, question_list, total_time} = element
            question_list.forEach(element2=>{ 
                const {_id} = element2
                var quest_id = element2._id
                    quest_list.push({quest_id})
            });
            var new_data ={
                mock_no_of_items:quest_list.length,
                mock_un_answered:quest_list.length,
                mock_id:element._id,
                mock_questions:quest_list,
                total_time:total_time
            }
            set_data.push(new_data)
        });

        var set_mock ={
            user_id:_id,
            users_mock:[{
                course_id:c_id,
                mock_details:set_data
            }]
        }
        exam_mock_session.create(set_mock);
    };
    async function main() {
        try {
            var if_exist = await findSession();
            var find_questions = await findQuestions();
            var get_questions = await getQuestions();
            // count of question per sub object 
            if(find_questions.length > 0){
                var cnt_l = await getQuestionPerLesson(get_questions)
                var cnt_a = await getQuestionPerAssessment(get_questions)
                var cnt_c = await getQuestionPerCourse(get_questions)
                // study session 
                var get_lessons = await getLesson(find_questions,cnt_a);
                var exp_date = await computeExpiryDate()
                var map_data = await mapData(get_lessons,exp_date,  cnt_c);
                var get_mock = await getMockExam()
                var user_mock = await getMockUser()
                if(if_exist === null){
                    var to_be_save = await dataSave(map_data)
                    var save_data = await saveData(to_be_save)
                    //mock session
                    if(user_mock === null){
                        var save_mock = await saveMock(get_mock)
                    }
                    res.send(200, {code: "Success", msg : "New Exam Session successfully Taken",map_data}); 
                }else{
                    var find_course = await findCourse(if_exist)
                    if(find_course === 1 ){
                        res.send(403, {code: "CONFLICT", msg : "Course Already taken"});
                    }else{
                        var to_update =await setToupdate(if_exist,map_data)
                        var update_data = await updateData(to_update)
                        //mock session
                        var update_user_mock = await updateUserMock(user_mock,get_mock);
                        res.send(200, {code: "Success", msg : " Exam Session successfully Taken",if_exist}); 
                    } 
                }
            }else{
                res.send(404, {code: "NOT FOUND", msg : "NO questions available"}); 
            }
            
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while saving the exam session", e});
        }
    }
    main ();
}