//this api is for editing of courses   
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions');
const _ = require('lodash');
const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    var course_id = req.params._id;
    const
    getCourses = () => {

        return course.findOne({
            _id: course_id, 
            course_on_archive: 0,
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getExamSessions = () => {
        return exam_sessions.find({}).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateCourse = (courses) => {
        Object.keys(req.body).
        forEach(key => {
            courses[key] = req.body[key];
        });
    return courses;
    },
    saveCourse = (courses) => {
        return courses.save().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateLowerObjects = (c_id) => {
        assessments.updateMany(
            { course_id: course_id },
            { $set: { course_id: c_id } }
        ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

        lessons.updateMany(
            { course_id: course_id },
            { $set: { course_id: c_id } }
        ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

        questions.updateMany(
            { course_id: course_id },
            { $set: { course_id: c_id } }
        ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
        //console.log(assessment_id, c_id);
    },
    checkIfUsed = (sessions, c_id) => {
        var map_sessions = _.map(sessions, (element) => {
            var is_used = 0;
            //console.log(" === " + c_id.toString());
            _.forEach(element.session_details, (element2) => {
                //console.log(element2.course_id.toString() + " === " + c_id.toString());
                if(element2.course_id.toString() === c_id.toString()) {
                    is_used = 1;
                }
            });

            return is_used;
        });

        //console.log("before: " + map_sessions);
        _.remove(map_sessions, (element) => {
            return element === 0;
        });
        //console.log("after: " + map_sessions);

        return map_sessions.length;
    };
    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1) {
                var courses = await getCourses();
                if(courses){
                    var exam_session = await getExamSessions();

                    if(courses.is_draft == false) { //IF PUBLISHED YUNG COURSE TO BE EDITED
                        var is_used = await checkIfUsed(exam_session, courses._id);

                        if(is_used > 0) {
                            res.send(403, {code: "FORBIDDEN", msg : "Course cannot be edited"});
                        }
                        else {
                            var course_update = await updateCourse(courses);
                            var new_courses = await saveCourse(course_update);
                            res.send(200, {code: "Success", msg : "Course successfully updated", new_courses});
                        }
                    }
                    else { //IF DRAFT YUNG COURSE TO BE EDITED
                        if(req.body.is_draft === 0 && membership_type === 1) {
                            res.send(403, {code: "FORBIDDEN", msg : "Course cannot be edited"});
                        }
                        else {
                            var course_update = await updateCourse(courses);
                            var new_courses = await saveCourse(course_update);
                            res.send(200, {code: "Success", msg : "Course successfully updated", new_courses});
                        }
                    }
                    //console.log(req.body.is_draft + " - " + courses.is_draft);
                    
                    /*if(req.body.is_draft === 1 && courses.is_draft == false) {
                        //console.log("published to draft");
                        

                        if(is_used > 0) {
                            res.send(403, {code: "FORBIDDEN", msg : "Course cannot be edited"});
                        }
                        else {
                            var course_update = await updateCourse(courses);
                            var new_courses = await saveCourse(course_update);
                            res.send(200, {code: "Success", msg : "Course successfully updated", new_courses});
                        }
                    }
                    else if(req.body.is_draft === 0 && courses.is_draft == true) {
                        //console.log("draft to published");
                        var course_update = await updateCourse(courses);
                        var new_courses = await saveCourse(course_update);
                        res.send(200, {code: "Success", msg : "Course successfully updated", new_courses});
                    }
                    else {
                        //console.log("same draft status");
                    }*/
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Courses not found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating courses", e});
        }
    }

    main ();
}