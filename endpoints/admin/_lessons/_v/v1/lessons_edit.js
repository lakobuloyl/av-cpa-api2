//this api is for editing of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const _ = require('lodash');
const exam_sessions = require('../../../../../models/exam_sessions');
const questions = require('../../../../../models/questions');
const lessons = require('../../../../../models/lessons.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const lesson_id = req.params._id;
    //var { _id } = req.params;
    const
    getLessons = () => {
        return lessons.findOne({
            _id: lesson_id,
            lesson_on_archive: false,
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
    updateLessons = (lessons) => {
        Object.keys(req.body).
        forEach(key => {
            lessons[key] = req.body[key];
        });
    return lessons;
    },

    saveLessons = (lessons) => {
        return lessons.save().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateLowerObjects = (c_id) => {
        questions.updateMany(
            { lesson_id: lesson_id },
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
                var lessons = await getLessons();

                if(lessons) {
                    var exam_session = await getExamSessions();

                    if(lessons.is_draft == false) { //IF PUBLISHED YUNG LESSON TO BE EDITED
                        var is_used = await checkIfUsed(exam_session, lessons.course_id);

                        if(is_used > 0) {
                            res.send(403, {code: "FORBIDDEN", msg : "Lesson cannot be edited"});
                        }
                        else {
                            if(req.body.course_id.toString() !== lessons.course_id.toString()) {
                                //console.log("not same2");
                                await updateLowerObjects(lessons.course_id);
                            }

                            var lesson_update = await updateLessons(lessons);
                            var new_lesson = await saveLessons(lesson_update);
                            res.send(200, {code: "Success", msg : "Lesson successfully updated", new_lesson});
                        }
                    }
                    else { //IF DRAFT YUNG LESSON TO BE EDITED
                        if(req.body.is_draft === 0 && membership_type === 1) {
                            res.send(403, {code: "FORBIDDEN", msg : "Lesson cannot be edited"});
                        }
                        else {
                            if(req.body.course_id.toString() !== assessments.course_id.toString()) {
                                await updateLowerObjects(lessons.course_id);
                                //console.log("not same");
                            }

                            var lesson_update = await updateLessons(lessons);
                            var new_lesson = await saveLessons(lesson_update);
                            res.send(200, {code: "Success", msg : "Lesson successfully updated", new_lesson});
                        }
                    }
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Lesson not found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating lesson", e});
        }
    }

    main ();
}