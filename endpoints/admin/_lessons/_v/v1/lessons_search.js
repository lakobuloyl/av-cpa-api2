//this api is for search of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lessons = require('../../../../../models/lessons.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getLessons = () => {
        if(membership_type === 0) {
            if(is_draft === 2) {
                if(_id != 0) {
                    return lessons.find({ 
                        $or: [
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
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
                    return lessons.find({ 
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
            }
            else {
                if(_id != 0) {
                    return lessons.find({ 
                        $or: [
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        lesson_on_archive: 0,
                        is_draft: is_draft
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
                    return lessons.find({ 
                        lesson_on_archive: 0,
                        is_draft: is_draft
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
            }
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            if(is_draft === 2) {
                if(_id != 0) {
                    return lessons.find({ 
                        $or: [
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        lesson_on_archive: 0,
                        created_by: user_id
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
                    return lessons.find({ 
                        lesson_on_archive: 0,
                        created_by: user_id
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
            }
            else {
                if(_id != 0) {
                    return lessons.find({ 
                        $or: [
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        lesson_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
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
                    return lessons.find({ 
                        lesson_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
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
            }
        }
    },
    getLessonsByUser = (lessons) => {
        const user_id = decodeToken(req.headers['x-access-token'])._id;
        if(membership_type === 1) {
            return _.filter(lessons, (element) => {
                return element.created_by.toString() === user_id.toString();
            });
        }
        else {
            return lessons;
        }
    },
    searchLessons = (lessons) => {
        return _.filter(lessons, (element) => {
            var x = new RegExp(_.escapeRegExp(search), "i");
            //console.log("x: " + element.course_id.course_name + " - " + element.assessment_name.match(/search/g));
            return x.test(element.course_id.course_name) || x.test(element.assessment_id.assessment_name) || x.test(element.lesson_name);
        });
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
                _id, lesson_name, lesson_desc, course_id, assessment_id, is_draft
             } = lessons_display;

            var status;
            if(is_draft) {
                status = "Draft";
            }
            else {
                status = "Published";
            }

            return {
                _id, lesson_name, lesson_desc, course_id, assessment_id, status
            };
        });
    };

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var lessons = await getLessons();
                var lessons_by_user = await getLessonsByUser(lessons);
                lessons = lessons_by_user;

                if(lessons.length > 0 ) {
                    if(_id == 0) {
                        var search_lessons = await searchLessons(lessons);
                        lessons = search_lessons;
                    }

                    var number_of_pages = getNumberOfPages(lessons);
                    var paged_lessons = await getPagedLessons(lessons);
                    var map_lessons = mapLessons(paged_lessons);
                    res.send(200, {code: "Success", msg : "Lessons retrieved", number_of_pages, map_lessons});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No lesson found", lessons});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving lesson", e});
        }
    }

    main ();
}