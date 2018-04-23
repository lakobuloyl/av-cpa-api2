
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_session = require('../../../../../models/exam_sessions');
const _ = require('lodash');
const course = require('../../../../../models/course'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){  

    const limit = req.body.limit || 6;
    const page = req.body.page || 1;

    const
    getCourse = () => {
    return course.find({is_draft:0,course_on_archive:0})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    getNumberOfPages = (courses) => {
        return Math.ceil(courses.length / limit);
    },
    getPagedCourses = (courses) => {
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        console.log(drop_course);
        _.pull(take_course, undefined);
        //console.log(take_course);
        if(take_course.length > 0) {
            return take_course;
        }
        else {
            return [];
        }
    },
    mapCourse = (courses) => {
        return courses.map(courses_display => {
            const { _id, course_name, course_desc, subscription_plans, course_image } = courses_display;

            return { _id, course_name, course_desc, subscription_plans, course_image };
        });
    };
    async function main() {
        try {
            var get_course = await getCourse();
            var number_of_pages = await getNumberOfPages(get_course);
            var paged_courses = await getPagedCourses(get_course);
            var mapped_course = await mapCourse(paged_courses);
            
            res.send(200, {code: "Success", msg : "Courses retrieved. ", number_of_pages, mapped_course}); 
                
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving course list.", e});
        }
    }

    main ();
}