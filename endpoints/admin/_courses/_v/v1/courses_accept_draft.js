//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');
const _ = require('lodash');
const lessons = require('../../../../../models/lessons.js');
const assessments = require('../../../../../models/assessment.js');
const questions = require('../../../../../models/questions.js');
const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {id} = req.body
    const
    getCourses = () => {
        return course.find({is_draft:1,course_on_archive:0})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapCourse = (courses) =>{
        return courses.map(courses_display => {
            const {
                _id,course_name,course_desc,subscription_plans, is_draft
               // _id,course_name,course_desc,course_pricing, is_draft
             } = courses_display;
            return {
                _id,course_name,course_desc,subscription_plans, is_draft
                //_id,course_name,course_desc,course_pricing, is_draft
            };
        });
    },
    updateLowerObjects = (courses) => {
        _.forEach(courses, (element) => {
            var c_id = element._id;
            //console.log(c_id);

            assessments.updateMany(
                { course_id: c_id },
                { $set: { is_draft: false } }
            ).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    
            lessons.updateMany(
                { course_id: c_id },
                { $set: { is_draft: false } }
            ).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    
            questions.updateMany(
                { course_id: c_id },
                { $set: { is_draft: false } }
            ).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
            //console.log(assessment_id, c_id);
        });
        
        
    },
    editDataList = (display_course,id) =>{
        display_course.forEach(element => {
            const {is_draft, _id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                        return course.findByIdAndUpdate(
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
            }); 
        });
    };
    async function main() {
        try {
            if(membership_type === 0)
            {
                var courses = await getCourses();
                //console.log(courses);
                if(courses !== null){
                    var display_course = await mapCourse(courses)
                    
                    await updateLowerObjects(display_course);
                    var edit_list = await editDataList(display_course,req.body)
                    res.send(200, {code: "Success", msg : "Courses verify successfully"});
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