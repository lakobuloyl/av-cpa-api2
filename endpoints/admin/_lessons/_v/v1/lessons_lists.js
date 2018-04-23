//this api is for display of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lesson = require('../../../../../models/lessons.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');;

module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const { course_by, assessment_by } = req.body;
    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getAllLessons = () => {
        if(membership_type === 0) {
            return lesson.find({ 
                lesson_on_archive: 0
            }).sort({ is_draft: -1 }).
            populate({
                path : "assessment_id",
                select: "assessment_name"
            }).populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
        else {
            return lesson.find({ 
                lesson_on_archive: 0,
                created_by: _id
            }).sort({ is_draft: -1 }).
            populate({
                path : "assessment_id",
                select: "assessment_name"
            }).populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
    },
    getLessonsByDraft = (lessons) => {
        if(is_draft === 2) {
            return lessons;
        }
        else {
            return lesson.find({
                lesson_on_archive: 0,
                is_draft: is_draft
            }).populate({
                path : "assessment_id",
                select: "assessment_name"
            }).populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
    },
    getLessonsByCourse = (lessons) => {
        if(course_by) {
            return _.filter(lessons, (element) => {
                return element.course_id._id == course_by;
            });
        }
        else {
            return lessons;
        }
    },
    getLessonsByAssessment = (lessons) => {
        if(assessment_by) {
            return _.filter(lessons, (element) => {
                return element.assessment_id._id == assessment_by;
            });
        }
        else {
            return lessons;
        }
    },
    getPagedLessons = (lessons) => {
        var drop_lesson = _.drop(lessons, (limit * page) - limit);
        var take_lesson = _.take(drop_lesson, limit);
        
        return take_lesson;
    },
    getNumberOfPages = (lessons) => {
        return Math.ceil(lessons.length / limit);
    },
    mapLessons = (lessons) => {
        return lessons.map(lessons_display => {
            const {
                _id, lesson_name, lesson_desc, assessment_id, course_id, is_draft
            } = lessons_display;

            if(is_draft) {
                var status = "Draft";
            }
            else {
                var status = "Published";
            }

            return {
                _id, lesson_name, lesson_desc, assessment_id, course_id, status
            };
        });
    };

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var lessons = await getAllLessons();

                if(lessons.length > 0) {
                    var lessons_by_draft = await getLessonsByDraft(lessons);
                    var lessons_to_page = lessons_by_draft;

                    if(lessons_by_draft.length > 0) {
                        if(assessment_by) {
                            var lessons_by_assessment = await getLessonsByAssessment(lessons_by_draft);
                            lessons_to_page = lessons_by_assessment;
                        }
                        else {
                            if(course_by) {
                                var lessons_by_course = await getLessonsByCourse(lessons_by_draft);
                                lessons_to_page = lessons_by_course;
                            }
                        }

                        if(lessons_to_page.length > 0) {
                            var number_of_pages = getNumberOfPages(lessons_to_page);
                            var paged_lessons = await getPagedLessons(lessons_to_page);
                            var map_lessons = await mapLessons(paged_lessons);
                            res.send(200, {code: "Success", msg : "Lessons retrieved", number_of_pages, map_lessons});
                        }
                        else {
                            res.send(404, {code: "NOT FOUND", msg : "No Lessons to display"});
                        }
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "No Lessons to display"});
                    }
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "No Lessons to display"});
                }
             // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Lessons", e});
        }
    }

    main ();
}