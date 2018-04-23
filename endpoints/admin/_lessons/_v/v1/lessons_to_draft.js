//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const exam_session = require('../../../../../models/exam_sessions');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getLesson = () => {
        return lessons.findOne({_id:req.params.lesson_id,lesson_on_archive:0})
        .populate({
            path:'course_id',
            select:'course_name'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }, 
    courseInSession = (in_session) => {
        return exam_session.findOne({
            session_details:{
                $elemMatch:{
                    course_id:in_session.course_id
                }
            }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    editDataList = () =>{
        lessons.findByIdAndUpdate({_id:req.params.lesson_id},
            {$set:{
                is_draft:true
            }})
            .then(data => {return data; })
            .catch(err => { throw err;});

        questions.updateMany({lesson_id:req.params.lesson_id },
            {$set:{
                is_draft:true}
            })
            .then(data => {return data;})
            .catch(err => {throw err;  });
                       
    };
    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1 ){
                var lesson = await getLesson();
                if(lesson){
                    var in_session = await courseInSession(lesson)
                    if(in_session){
                        res.send(409, {code: "CONFLICT", msg : "Lessons can't move to draft. Users already accessing this Lesson"});
                    }else{
                        var edit_list = await editDataList()
                        res.send(200, {code: "Success", msg : "lesson move to draft successfully"});
                    }
                }else{
                    res.send(404, {code: "NOT FOUND", msg : "no lesson to display"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}