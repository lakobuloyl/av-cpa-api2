//this api is for create package
// API version 2 
// junryl
var _ = require('lodash');
const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){  

    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const user_id = _id;
    const {course_id,duration} = req.body
    const
    getSession = () => {
        return exam_sessions.findOne({user_id:user_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    computeExpiryDate = () =>{
        var date_expiration = new Date(Date.now());
            month = date_expiration.getMonth(),
            year = date_expiration.getFullYear();
            convertd_m= parseInt(month);
            convertd_d= parseInt(duration);
        var due = parseInt(duration)
            var new_month = convertd_m + due

            if (new_month >12){
                var added =  new_month - 13
                var new_year = year + 1
                date_expiration.setMonth(added);
                date_expiration.setFullYear(new_year)
                var new_date = date_expiration.toISOString()
                        return new_date;
            }
            else{
                date_expiration.setMonth(new_month);
                var new_date = date_expiration.toISOString()
                        return new_date;
            }
    },
    mapSession =(exam_session,exp_time) =>{
        var session_details = exam_session.session_details
            session_details.map(elem =>{
                var { course_id,is_expired,date_expiration } = elem
                    if(elem.course_id.toString() === req.body.course_id.toString() ){
                        if(is_expired === true){
                            var is_false = false
                            elem.date_expiration =exp_time,
                            elem.is_expired = is_false
                        }
                    }
            });
            return exam_session
    },
    saveSession =(map_session) =>{
        return exam_sessions.findOneAndUpdate({user_id:user_id},
            {
                $set:{
                    session_details:map_session.session_details
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
                var exam_session = await getSession();
                var exp_time = await computeExpiryDate()
                var map_session = await mapSession(exam_session,exp_time)
                var save_session = await saveSession(map_session)
                    res.send(200, {code: "Success", msg : "Renew Session Successfully"}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}