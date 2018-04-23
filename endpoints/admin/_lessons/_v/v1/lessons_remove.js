//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {id} = req.body
    const
    getLesson = () => {
        return lessons.find({lesson_on_archive:0})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapLesson = (lesson) =>{
        return lesson.map(lessons_display => {
            const {
                _id,lesson_on_archive
             } = lessons_display;
            return {
                _id,lesson_on_archive
            };
        });
    },
    editDataList = (display_lesson,id) =>{
        display_lesson.forEach(element => {
            const {is_draft, _id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                        lessons.findByIdAndUpdate(
                            {_id:element._id  },
                                {$set:{
                                    lesson_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });
                        questions.updateMany(
                            {lesson_id:element._id  },
                                {$set:{
                                    questions_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });
                       
                    }
            }); 
        });
    };
    async function main() {
        try {
            if(membership_type === 0)
            {
                var lesson = await getLesson();
                if(lesson !== null){
                    var display_lesson = await mapLesson(lesson)
                    var edit_list = await editDataList(display_lesson,req.body)
                    res.send(200, {code: "Success", msg : "lesson move to archive successfully"});
                }
                else{
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