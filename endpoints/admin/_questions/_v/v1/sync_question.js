
//this api is for create session
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_session = require('../../../../../models/exam_sessions');
const course = require('../../../../../models/course');
const questions = require('../../../../../models/questions');
const assessment = require('../../../../../models/assessment');
const lessons = require('../../../../../models/lessons'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
var _ = require('lodash');


module.exports = function(req,res,next){ 
   // const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const {course_id} = req.body
    var c_id = course_id.toString()
    const
    findSession = () =>{
        return exam_session.find({
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
    findAssessment = () =>{
        return assessment.find({is_draft:0,assessment_on_archive:0,course_id: c_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
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
        .populate({
            path:'assessment_id',
            select:'assessment_name'
        })
        .populate({
            path:'course_id',
            select:'course_name'
        })
        .populate({
            path:'lesson_id',
            select:'lesson_name'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
    },
    ////////////////////////////////  counting functions
    getQuestionPerLesson = (find_questions) => {
        var result = _(find_questions)
        .groupBy('lesson_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        return result;
    },
    getQuestionPerAssessment = (find_questions) => {
        var result = _(find_questions)
        .groupBy('assessment_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        return result;
    },
    getQuestionPerCourse = (find_questions) =>  {
        var result = _(find_questions)
        .groupBy('course_id._id')
        .map(function(items, _id) { 
        return { _id: _id, count: items.length };
        }).value();
        var data_set = ""
         result.forEach(element =>{
            const {_id,count} = element
            if(_id.toString() === course_id.toString())
            { data_set= element.count }
        });
        return data_set
    },
    getLesson = (find_questions,cnt_a,find_assessment) => {
        var questions_array = [];
        find_questions.forEach(element => {
           const { _id,  lesson_id,course_id ,assessment_id } = element;
           find_assessment.forEach(elem =>{
                const {_id} = elem;
                cnt_a.forEach(element2=>{
                    const {_id, count} = element2
                     if(element.assessment_id.toString() === elem._id.toString()){
                        if(_id.toString() === element.assessment_id.toString()){
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
           }); // end of session details
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
    mapData = (get_lessons,exp_date, cnt_c) =>{
        var groups = _.groupBy(get_lessons, 'assessment_id');
        var result = _.map(groups, function(assess){
            return {
                course_id: assess[0].course_id,
                assessment_id: assess[0].assessment_id,
                no_of_items:assess[0].count,
                correct_lesson:0,
                incorrect_lesson:0,
                un_answered: 0,
                lessons: _.map(assess, function(lessons){
                    return {
                        course_id:lessons.course_id,
                        assessment_id:lessons.assessment_id,
                        lesson_id:lessons.lesson_id,
                        question_id:lessons.question_id,
                        no_of_items:0,
                        correct_lesson:0,
                        incorrect_lesson:0,
                        un_answered:0,
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
                        un_answered:0,
                        lessons:assessment.lessons
                    }
                })
            }
        });
        return result2
    },
    changeNewitems =(find_session,map_data)=>{
        var new_session =  find_session.forEach(fs =>{
            var {_id, session_details} = fs
            session_details.forEach(sd =>{
                var { course_id, un_answered, incorrect_assess, correct_assess, assessment} = sd
                map_data.forEach(md => {
                    var { course_id, un_answered, incorrect_assess, correct_assess, assessment} = md
                    if(md.course_id.toString() === sd.course_id.toString()){
                        sd.un_answered = md.un_answered,
                        sd.incorrect_assess = md.incorrect_assess
                        sd.correct_assess = md.correct_assess
                        sd.assessment = md.assessment
                    }
                }); 
            })
        }); // end of fs 
        return find_session
    },
    mapQuestionStatus = (find_session) =>{
          return find_session.map(fs =>{
            var {_id, course_id, session_details} = fs
            return fs.session_details.map(sd =>{
                var { course_id, un_answered, incorrect_course, correct_course, assessment} = sd
                return sd.assessment.map(cnt_a =>{
                    var { assessment_id, un_answered, incorrect_assess, correct_assess, lessons} = cnt_a
                    return cnt_a.lessons.map(cnt_l =>{
                        var {lesson_id, un_answered, incorrect_lessons, correct_lesson, lesson_details} = cnt_l
                        return cnt_l.lesson_details.map(cnt_ld =>{
                            var {question_id, status} = cnt_ld
                                 return {_id ,assessment_id, lesson_id, course_id, question_id, status}
                        });
                    })//
                });
            })
        }); // end of fs 
    },
    flatStatusArray = (map_status) =>{
        var merged = [].concat.apply([], map_status);
        var merged2 = [].concat.apply([], merged);
        var merged3 = [].concat.apply([], merged2);
        var merged4 = [].concat.apply([], merged3);
        return merged4
    }
    updateSession = (chnge_new_items,flat_status) =>{
        var to_set =0;
        var c_crs = in_crs  = u_crs = c_ass = in_ass = u_ass = c_less = in_less = u_less =0 ;
        chnge_new_items.forEach(cnt =>{
            var {_id, course_id, session_details} = cnt
            cnt.session_details.forEach(sd =>{
                var {no_of_items, course_id, un_answered, incorrect_course, correct_course, assessment} = sd
                sd.assessment.forEach(cnt_a =>{
                    var {no_of_items, assessment_id, un_answered, incorrect_assess, correct_assess, lessons} = cnt_a
                    cnt_a.lessons.forEach(cnt_l =>{
                        var {no_of_items,lesson_id, un_answered, incorrect_lessons, correct_lesson, lesson_details} = cnt_l
                        cnt_l.lesson_details.forEach(cnt_ld =>{
                            var {question_id, status} = cnt_ld
                            flat_status.forEach(fs =>{
                                var {assessment_id, lesson_id, course_id, question_id, status} = fs 
                                if(cnt._id.toString() === fs._id.toString()){
                                    if(sd.course_id.toString() === fs.course_id.toString()){
                                        if(cnt_a.assessment_id.toString() === fs.assessment_id.toString()){
                                            if(cnt_l.lesson_id.toString() === fs.lesson_id.toString()){
                                                if(cnt_ld.question_id.toString() === fs.question_id.toString()){
                                                    cnt_ld.status = fs.status
                                                    ++to_set
                                                    if(fs.status === 1){
                                                        ++sd.correct_course 
                                                        ++cnt_a.correct_assess 
                                                        ++cnt_l.correct_lesson 
                                                       
                                                    }
                                                     if(fs.status === 2){
                                                        ++cnt_l.incorrect_lessons
                                                        ++sd.incorrect_course 
                                                        ++cnt_a.incorrect_assess 
                                                    } if(fs.status ===0){
                                                        ++sd.un_answered
                                                        ++cnt_a.un_answered 
                                                        ++cnt_l.un_answered 
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    sd.no_of_items = to_set;
                                }
                            });
                        });
                    })//
                });
            })
            exam_session.updateMany(
                {_id:cnt._id  },
                    {$set:{
                        session_details:cnt.session_details
                        }
                    }).
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }); // end of fs 
        return chnge_new_items

    };
    async function main() {
        try {
            //// session 
            var find_session = await findSession();

            var find_assessment = await findAssessment();
            var get_questions = await getQuestions();
            var find_questions = await findQuestions();
           // count of question per sub object 
            var cnt_l = await getQuestionPerLesson(get_questions)
            var cnt_a = await getQuestionPerAssessment(get_questions)
            var cnt_c = await getQuestionPerCourse(get_questions)

            var get_lessons = await getLesson(find_questions,cnt_a,find_assessment);
            var map_data = await mapData(get_lessons, cnt_c);

            var map_status = await mapQuestionStatus(find_session)
            var flat_status = await flatStatusArray(map_status)

            var chnge_new_items = await changeNewitems(find_session,map_data);
            var update_session = await updateSession(chnge_new_items,flat_status);
            res.send(200, {code: "Success", msg : "New Exam Session successfully Taken" ,update_session}); 
            
            
   
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while saving the exam session", e});
        }
    }
    main ();
}