//this api is for adding of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lessons = require('../../../../../models/lessons');
const course = require('../../../../../models/course');

module.exports = function(req,res,next){
     //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const{ assessment_id} = req.params
    const
    getLesson = () => {
        return lessons.find(
            {lesson_on_archive:0,
                assessment_id:assessment_id } )
        .populate({
            path:"course_id",
            select:"course_name"
        })
        .populate({
            path:"assessment_id",
            select:"assessment_name"
        })
        .exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    mapLesson = (lesson) =>
    {
        // return lesson.map(lesson_display => {
        //     const {
        //         _id,
        //         lesson_name,
        //         lesson_desc
        //      } = lesson_display;
        //     return {
        //         _id,
        //         lesson_desc,
        //         lesson_name
        //     };
        // });
    };

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var lesson =await getLesson()
                if(lesson.length >0)
                {
                    var map_lesson =await mapLesson(lesson)
                    res.send(200, {code: "Success", msg : "lesson retrieved", lesson});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "lesson not found"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Assessments", e});
        }
    }

    main ();
}