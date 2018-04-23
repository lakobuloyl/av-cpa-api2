//this api is for search of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lessons = require('../../../../../models/lessons.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {lesson_id} = req.params
    const
    getLessons = () => {
        return lessons.findById({_id:lesson_id})
        .populate({
            path : "assessment_id",
            select: "assessment_name"
        }
    )
    .populate({
        path : "course_id",
        select: "course_name"
    }
    ).exec()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var lessons = await getLessons();
                if(lessons)
                {
                    res.send(200, {code: "Success", msg : "Lessons retrieved", lessons});
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