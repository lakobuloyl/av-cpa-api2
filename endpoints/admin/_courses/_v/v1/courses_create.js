//this api is for adding of courses   
// API version 2 
// junryl

const mongoose = require('mongoose');
const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const {_id, membership_type } = decodeToken(req.headers['x-access-token']);
    const
    createCourses = () => {
        var to_save = req.body;

        if(membership_type === 1){
            to_save.is_draft = true;
        }

        to_save.created_by = _id;
        var add_courses = Object.assign({}, to_save);
        
        return add_courses;
    }
    async function main() {
        try {
            if(membership_type === 0 || membership_type=== 1)
            {
                var courses = await createCourses();
                    course.create(courses);
                    res.send(200, {code: "Success", msg : "Course successfully Added", courses});
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while saving the course", e});
        }
    }

    main ();
}