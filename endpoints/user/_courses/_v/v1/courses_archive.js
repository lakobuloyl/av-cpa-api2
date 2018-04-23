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

    const is_expired = req.body.is_expired || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    const
    getCourses = () => {
        return exam_session.findOne({user_id:_id})
        .populate({
            path:"session_details.course_id",
            select:"course_name course_image course_desc is_expired "
            })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

    },
    mapCourse=(map_course) =>{
        return map_course.map(sd =>{
            var {course_id, un_answered, no_of_items, completion_c, is_expired, date_expiration} = sd
            var comp_c =Math.abs(sd.no_of_items - sd.un_answered);
            var compute_c = Math.round((comp_c/ sd.no_of_items)*100);
                sd.completion_c = compute_c
                var _id = course_id._id;
                var course_name = course_id.course_name;
                var course_image = course_id.course_image;
                //console.log("id: " + course_id + " - " + is_expired);
            if(is_expired == req.body.is_expired){
                return {_id,course_name, course_image,completion_c, is_expired, date_expiration}
            }

        });
         
    },
    getPagedCourses = (courses) => {
        //console.log("set_data2: "+courses);
        //console.log("courses: " + Array.isArray(courses));
        var drop_course = _.drop(courses, (limit * page) - limit);
        //console.log("drop_course: " + Array.isArray(drop_course));
        var take_course = _.take(drop_course, limit);
        //console.log("take_course: " + Array.isArray(take_course));
       
        _.pull(take_course, undefined);
        if(take_course.length > 0) {
            return take_course;
        }
        else {
            return [];
        }
    };
    async function main() {
        try {
                var courses = await getCourses();
                if(courses !== null)
                {   
                    var map_course = courses.session_details;
                    //console.log(map_course);
                    var set_data = await mapCourse(map_course);
                    //console.log("set_dataa: "+set_data);
                    var paged_courses = await getPagedCourses(set_data);
                    
                    if(paged_courses.length > 0) {
                        res.send(200, {code: "Success", msg : "Courses retrieved", paged_courses});
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "No Courses to Display", paged_courses});
                    }
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Courses to Display"});
                }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving courses", e});
        }
    }

    main ();
}