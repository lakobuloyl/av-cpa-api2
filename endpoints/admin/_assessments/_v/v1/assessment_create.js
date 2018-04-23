//this api is for adding of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course'),
user = require('../../../../../models/user'),
{
    decodeToken
}
 = require('../../../../../services/core_services')

const exam_session = require('../../../../../models/exam_sessions');
 
module.exports = function(req,res,next){
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']); 
    const {course_id } = req.body
    const
    getCourse = () =>{
        return course.findOne({_id:course_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    }
    createAssess = () => {
        var to_save = req.body
        if(membership_type === 1){
            to_save.is_draft=true
        }
        to_save.created_by=_id;
        var add_assess = Object.assign({}, to_save);
        return add_assess;
    };
    
    async function main() {
        try {
            if(membership_type === 0 ||membership_type === 1)
            {
                var get_course = await getCourse();
                if(get_course) {
                    var assess = await createAssess();
                    assessment.create(assess);
                    res.send(200, {code: "Success", message : "Assessment successfully added.", assessment});
                }
                else {
                    res.send(409,{code:"CONFLICT", message: "Cannot add. This course is not a draft."});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            }  
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", message : "An error happened while saving the assessment", e});
        }
    }

    main ();
}