//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');
const questions = require('../../../../../models/questions');
var _ = require('lodash')

module.exports = function(req,res,next){
     var { c_id} = req.params;
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getCourses = () => {
        return questions.find({ course_id:c_id, questions_on_archive:false, is_draft: false})
        .populate({  path:'assessment_id', select:'assessment_name'  })
        .populate({  path:'course_id',  select:'course_name course_desc subscription_plans course_image'})
        .populate({  path:'lesson_id',  select:'lesson_name'  })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });   
    },
    grpData = (get_question) =>{
        var new_list = get_question.map(g_q =>{
            var {course_id,assessment_id, lesson_id , _id } = g_q
            return  new_item ={
                course_id:g_q.course_id._id,
                assessment_id:g_q.assessment_id,
                lesson_id:g_q.lesson_id,
                question_id:g_q._id,
                course_details:g_q.course_id
                }  
            });

         var groups = _.groupBy(new_list, 'lesson_id');
        var result1 = _.map(groups, function(assess){
            return {
               lesson_id: assess[0].lesson_id,
               course_id: assess[0].course_id,
               assessment_id: assess[0].assessment_id,
               no_of_items:assess.length,
               count:assess.length,
               course_details:assess[0].course_details,
            }
        });

        var groups2 = _.groupBy(result1, 'assessment_id');
        var result2 = _.map(groups2, function(assess){
            return {
                course_id: assess[0].course_id,
                assessment_id: assess[0].assessment_id,
                no_of_items:0,
                course_details:assess[0].course_details,
                lessons: _.map(assess, function(lessons){
                    return {
                        lesson_id:lessons.lesson_id,
                        no_of_items:lessons.no_of_items,
                    }
                })
            }
        });
        var groups3 = _.groupBy(result2, 'course_id');
        var result3 = _.map(groups3, function(assess){
            return {
                course_id: assess[0].course_id,
                no_of_items:0,
                course_details:assess[0].course_details,
                assessment: _.map(assess, function(assessment){
                    return {
                        assessment_id:assessment.assessment_id,
                        no_of_items:assessment.no_of_items,
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
                count_c.map(c=>{
                    console.log(reslt.course_id.toString() , c._id.toString());
                    if(reslt.course_id.toString() === c._id.toString()){
                        var counts = c.count
                        reslt.no_of_items = counts
                    }
                })
        });
        result3.map(reslt =>{
            reslt.assessment.map(r_a=>{
                 count_a.map(a=>{
                    if(r_a.assessment_id._id.toString() === a._id.toString() ){
                        var counts = a.count
                        r_a.no_of_items = counts
                    }
                })
            })
        });
        return result3
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var get_question = await getCourses();
                if(get_question !== null){
                    var res_data = await grpData(get_question)
                    res.send(200, {code: "Success", msg : "Courses retrieved", res_data});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no Courses to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}