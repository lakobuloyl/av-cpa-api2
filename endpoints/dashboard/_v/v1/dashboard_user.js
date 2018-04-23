//this api is for dashboard   
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../models/exam_sessions');
const  { decodeToken } = require('../../../../services/core_services');

module.exports = (req, res, next) => {
const { _id } = decodeToken(req.headers['x-access-token']);
const
    getNumberExams = () => {
        return exam_sessions.findOne({user_id:_id}) // user only 
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapSesssion = (exams) =>{
        var number_courses = 0
        exams.session_details.map( element =>{
            ++number_courses
        })
        return number_courses
    },

    sendSuccess = (res, data, msg) => {
        res.send(200, {
            data,
            msg,
        });
    };
    
async function main() {
    try {
        var exams= await getNumberExams();
        var map_session = await mapSesssion(exams)
        sendSuccess(
            res,
            { number_of_courses :map_session },
            "Dashboard successfully fetched!"
        );
    }
    catch (e) {
        console.log(e);
        sendError(res, e);
    }
}
main();
}