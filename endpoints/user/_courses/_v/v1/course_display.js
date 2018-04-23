

//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const course = require('../../../../../models/course');
const { decodeToken } = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){  
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getSession = () => {
        return course.findOne(req.params)
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    deconsData = (exam_sessions)=>{
        var set_data ={
            _id: exam_sessions._id,
            course_name: exam_sessions.course_name,
            course_description: exam_sessions.course_desc,
            course_image:exam_sessions.course_image
        }
        return set_data
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var course_data = await deconsData(exam_sessions)
            res.send(200, {code: "SUCCESS", msg : "Course successfully fetched", course_data});
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}