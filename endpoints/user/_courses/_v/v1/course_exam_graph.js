

//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions');
const { decodeToken } = require('../../../../../services/core_services');
var _ = require('lodash');
module.exports = function(req,res,next){  
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getSession = () => {
        return exam_sessions.findOne({user_id:_id},{
            session_details:{
                $elemMatch:{
                    course_id:req.params.course_id
                }
            }
        }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    deconsData = (exam_sessions)=>{
        
        return exam_sessions.session_details.map(sd=>{
            var { un_answered,incorrect_course,correct_course,no_of_items,completion_c} = sd
            var comp_c =Math.abs(sd.no_of_items - sd.un_answered);
            var compute_c = Math.round((comp_c/ sd.no_of_items)*100);
                var set_data ={
                    total:no_of_items,
                    correct:correct_course,
                    incorrect:incorrect_course,
                    skipped:un_answered,
                    progress:compute_c
                }
                return set_data
        });
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            if(exam_sessions){
                var course_data = await deconsData(exam_sessions)
                res.send(200, {code: "SUCCESS", msg : "Course successfully fetched", course_data});
            }else{
                res.send(409, {code: "NOT FOUND", msg : "NO graph statistics for this course", course_data});
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}