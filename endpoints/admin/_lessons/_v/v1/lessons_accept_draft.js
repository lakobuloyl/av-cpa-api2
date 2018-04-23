//this api is for display of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lessons = require('../../../../../models/lessons.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getLessons = () => {
        return lessons.find({is_draft:1,lesson_on_archive:0})
        .populate({
            path : "assessment_id",
            select: "assessment_name is_draft"
        }
    )
    .populate({
        path : "course_id",
        select: "course_name is_draft"
    }
    ).exec()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapLesson = (lesson) =>{
        return lesson.map(lesson_display => {
            const {
                _id,lesson_name,lesson_desc, is_draft,assessment_id
             } = lesson_display;
            return {
                _id,lesson_name,lesson_desc, is_draft,assessment_id
            };
        });
    },
    editDataList = (display_lesson,id) =>{
        var if_true =0
        display_lesson.forEach(element => {
            const {is_draft, _id,assessment_id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                        if(assessment_id.is_draft === false){
                            console.log(assessment_id.is_draft)
                            return lessons.findByIdAndUpdate(
                            {_id:element._id  },
                                {
                                    $set:{
                                        is_draft:false
                                    }
                                }
                                ).
                                then(data => {
                                    return data;
                                }).catch(err => {
                                    throw err;
                                });
                            }
                            else{
                               if_true =1
                            }
                            
                        }
                }); 
            });
            if(if_true ===0){
                res.send(200, {code: "Success", msg : "Lessons Accept draft"});
            }
            else{
                sendError(res, "CONFLICT", "Some lessons was not accepted because some assessment's lessons are not yet accepted");
            }
        },
    sendError = (res, error, msg) => {
        res.send(500, {
            code: 403,
            msg,
            error
        })
    };
    async function main() {
        try {
            if( membership_type ===0)
            {
                var lesson = await getLessons();
                if(lesson !== null )
                {
                    var display_lesson = await mapLesson(lesson)
                    var edit_list = await editDataList(display_lesson,req.body)
                  
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Lessons to display"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Lessons", e});
        }
    }

    main ();
}