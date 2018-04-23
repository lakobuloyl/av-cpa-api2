//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_logs = require('../../../../../models/exam_logs');
const { decodeToken} = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){  

    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const user_id=_id;
    const {log_id, exam_name } = req.body
    const
    /*getSession = () => {
        return exam_logs.findById({_id:log_id})
        .populate({
            path:'course_id',
            select:'course_name'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },*/
    updatelogs = () =>{
        return exam_logs.findByIdAndUpdate({_id:log_id}, {
                $set:{
                    exam_name:exam_name,
                }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };
    async function main() {
        try {
            //var exam_sessions = await getSession();
            //var get_question = await getQuestion(exam_sessions)
            //var get_user_Log =await getUserLog(exam_sessions,get_question)
            var update_logs = await updatelogs()
            //var log_ids = update_logs._id
                res.send(200, {code: "Success", msg : "logs successfully fetched"}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}