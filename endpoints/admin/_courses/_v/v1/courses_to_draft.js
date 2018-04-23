//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');

const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const exam_session = require('../../../../../models/exam_sessions');
 const assessment = require('../../../../../models/assessment');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const {_id, membership_type } = decodeToken(req.headers['x-access-token']);
   
    const
    courseInSession = () => {
        return exam_session.findOne({
            session_details:{
                $elemMatch:{
                    course_id:req.params.course_id
                }
            }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getCourses = () => {
        if(membership_type === 0){
            return course.findOne({_id:req.params.course_id, course_on_archive:0})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }else{
            return course.findOne({_id:req.params.course_id, course_on_archive:0, created_by:_id})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
      
    },
    editDataList = () =>{
        course.findByIdAndUpdate(
            {_id:req.params.course_id,created_by:_id },
                {$set:{
                    is_draft:true
                }
            })
            .then(data => {return data; }) 
            .catch(err => { throw err; });
                        
        assessment.updateMany({course_id:req.params.course_id  },
            {$set:{
                is_draft:true
                    }
            })
            .then(data => { return data; })
            .catch(err => { throw err; });

        lessons.updateMany({course_id:req.params.course_id },
            {$set:{
                is_draft:true
                    }
                })
            .then(data => {return data; })
            .catch(err => { throw err; });

        questions.updateMany({course_id:req.params.course_id  },
            {$set:{
                is_draft:true
                }
            }).
            then(data => {return data;})
            .catch(err => {throw err; });
                       
                  
    };
    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1 ){
                var in_session = await courseInSession();
                if(in_session){
                     res.send(409, {code: "CONFLICT", msg : "this course can't be move to draft. Users are already accessing this Course"});
                }else{
                    var courses = await getCourses();
                    if(courses){
                        var edit_list = await editDataList()
                        res.send(200, {code: "Success", msg : "Courses move to Draft successfully"});
                    }else{
                        res.send(404, {code: "NOT FOUND", msg : "no Courses to display"});
                    }
                }
                
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display error", e});
        }
    }

    main ();
}