//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
const course = require('../../../../../models/course.js');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getCourses = () => {
        return course.find({
            course_on_archive: 0,
            is_draft: true
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapCourse = (courses) =>
    {   
        return courses.map(courses_display => {
            const {_id,course_name, is_draft ,course_on_archive} = courses_display;
            return {_id,course_name, is_draft ,course_on_archive}
        });

    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var courses = await getCourses();
                if(courses !== null){
                    var display_course = await mapCourse(courses)
                        res.send(200, {code: "Success", msg : "Courses retrieved", display_course});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no Courses to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}