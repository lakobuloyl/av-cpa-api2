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
    var { course_name } = req.body;
    const
    getCourses = () => {
       
        return exam_session.findOne({user_id:_id})
        .populate({
            path:"session_details.course_id",
            select:"course_name"
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    searchCourse = (courses) =>{
        var course_fetched = []
        courses.session_details.map(c =>{
            const {
                course_id,
                date_registered,
                date_expiration, 
                assessment,
                completion_c, 
                un_answered,
                incorrect_course,
                correct_course,
                no_of_items,
                is_expired
            } = c
            
            var name = course_id.course_name.toString()
            var x = new RegExp('^'+_.escapeRegExp(req.body.course_name)+'.*', "i");
            //name2 = req.body.search;
            //console.log("asd",_.escapeRegExp(name),req.body.search , x.test(name)/*_.escapeRegExp(name).match(/req.body.search/gi)*/);
            if(x.test(name)){
                course_fetched.push( c )
            }
        })
        console.log(course_fetched);
        return course_fetched
    };
    async function main() {
        try {
                var courses = await getCourses();
                if(courses){
                    var search_course = await searchCourse(courses)
                    if(search_course.length > 0){
                        res.send(200, {code: "Success", msg : "Course retrieved", search_course});
                    } else{
                        res.send(404, {code: "NOT FOUND", msg : "No Course to Display"});
                    }
                } else{
                    res.send(404, {code: "NOT FOUND", msg : "No Course to Display"});
                }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving course", e});
        }
    }

    main ();
}