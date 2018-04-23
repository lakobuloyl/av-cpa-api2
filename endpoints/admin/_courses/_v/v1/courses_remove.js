//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');

const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const assessment = require('../../../../../models/assessment');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {id} = req.body
    const
    getCourses = () => {
        return course.find({course_on_archive:0})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapCourse = (courses) =>{
        return courses.map(courses_display => {
            const {
                _id,course_on_archive
             } = courses_display;
            return {
                _id,course_on_archive
            };
        });
    },
    editDataList = (display_course,id) =>{
        display_course.forEach(element => {
            const {is_draft, _id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                         course.findByIdAndUpdate(
                            {_id:element._id  },
                                {$set:{
                                        course_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });
                        
                        assessment.updateMany(
                            {course_id:element._id  },
                                {$set:{
                                        assessment_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });

                        lessons.updateMany(
                            {course_id:element._id  },
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
                            {course_id:element._id  },
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
                var courses = await getCourses();
                if(courses !== null){
                    var display_course = await mapCourse(courses)
                    var edit_list = await editDataList(display_course,req.body)
                    res.send(200, {code: "Success", msg : "Courses move to archive successfully"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no Courses to display"});
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