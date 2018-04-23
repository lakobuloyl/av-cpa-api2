//this api is for ``
// API version 2 
// junryl

const mongoose = require('mongoose');
const _ = require('lodash');
const exam_session = require('../../../../../models/exam_sessions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { _id } = decodeToken(req.headers['x-access-token']);

    //const is_expired = req.body.is_expired || 0;
    //const limit = req.body.limit || 100;
    //const page = req.body.page || 1;

    const
    getCourses = () => {
        return exam_session.findOne({user_id:_id},
            {session_details:
                {$elemMatch:{
                    course_id:req.params.course_id
                    } 
                }
            }
        )
        .populate({
            path:"session_details.course_id",
            select:"course_name"
            })
        .populate({
            path:"session_details.assessment.assessment_id",
            select:"assessment_name"
        })
        .populate({
            path:"session_details.assessment.lessons.lesson_id",
            select:"lesson_name"
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

    },
    mapCourse=(set_course) =>{
        set_course.forEach(sd =>{
            var { un_answered,incorrect_course,correct_course,no_of_items, assessment, course_id,completion_c} = sd
            var comp_c =Math.abs(sd.no_of_items - sd.un_answered);
            var compute_c = Math.round((comp_c/ sd.no_of_items)*100);
                sd.completion_c = compute_c
             assessment.forEach(assess =>{
                var { un_answered,incorrect_assess,correct_assess,no_of_items, lessons, assessment_id,completion_a} = assess
                var comp_a =Math.abs(assess.no_of_items - assess.un_answered);
                var compute_a =  Math.round((comp_a/ assess.no_of_items)*100);
                assess.completion_a = compute_a
                 lessons.forEach(less =>{
                    var { un_answered,incorrect_lessons,correct_lessons,no_of_items, assessment_id,completion_l} = less
                    var comp_l =Math.abs(less.no_of_items - less.un_answered);
                    var compute_l =   Math.round((comp_l/ less.no_of_items)*100);
                        less.completion_l =compute_l;
                    
                });
            });
        });
       return set_course
    };
    async function main() {
        try {
            // if(membership_type === 2)
            // {
                var courses = await getCourses();
                if(courses !== null)
                {   
                    var set_course = courses.session_details;
                    var set_data = await mapCourse(set_course);
                        res.send(200, {code: "Success", msg : "Courses retrieved", set_data});
               }
               else{
                    res.send(404, {code: "NOT FOUND", msg : "No Courses to Display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving courses", e});
        }
    }

    main ();
}