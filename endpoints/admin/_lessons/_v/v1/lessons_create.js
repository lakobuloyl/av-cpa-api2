//this api is for adding of lesson   
// API version 2 
// junryl

const mongoose = require('mongoose');
const lessons = require('../../../../../models/lessons.js'),
      assessment = require('../../../../../models/assessment.js'),
      course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const
     getCourse = () =>{
        return course.findOne({_id:req.body.course_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    },
    getAssessment = () =>{
        return assessment.findOne({_id:req.body.assessment_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    },
    createLessons = () => {
        //var is_draft =1;
        if(membership_type === 0) {
            var is_draft = req.body.is_draft;
        }
        else {
            var is_draft = 1;
        }
        //console.log(membership_type + " --- " + is_draft);

        var new_lesson = {
            lesson_name: req.body.lesson_name,
            lesson_desc: req.body.lesson_desc,
            assessment_id: req.body.assessment_id,
            course_id: req.body.course_id,
            is_draft: is_draft,
            created_by: _id
        };

        var add_lesson = Object.assign({}, new_lesson);
        return add_lesson;
    }

    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1)
            {
                var get_course = await getCourse()
                if(get_course){
                    var get_assessment = await getAssessment();

                    if(get_assessment) {
                        var lesson = await createLessons();
                        lessons.create(lesson);
                        res.send(200, {code: "Success", message : "Lesson successfully added.", lessons});
                    }
                    else {
                        res.send(409,{code:"CONFLICT", message: "Cannot add. This assessment is not a draft."});
                    }
                }
                else {
                    res.send(409,{code:"CONFLICT", message:"Cannot add. This course is not a draft."});
                }
            }
            else {
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", message : "An error happened while saving Lesson", e});
        }
    }

    main ();
}