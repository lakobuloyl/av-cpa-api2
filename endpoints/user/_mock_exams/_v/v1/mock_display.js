
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_mock_session = require('../../../../../models/exam_mock_session');
const questions = require('../../../../../models/questions');
var _ = require('lodash');
const { decodeToken } = require('../../../../../services/core_services');
module.exports = function(req,res,next){ 
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const {course_id } = req.params
    const
    getSession = () => {
        return exam_mock_session.findOne({user_id:_id},
        { 
        users_mock:{
            $elemMatch:{
                    course_id:course_id
                }
            }
        })
        .populate({
            path:'users_mock.mock_details.mock_id',
            select:'mock_exam_name mock_exam_description'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapMock =(exam_sessions) =>{
        var set_array = []
         exam_sessions.users_mock.map(u_m=>{
            var {course_idm, mock_details} = u_m
                mock_details.map(m_d=>{
                    var { mock_id, mock_no_of_items, mock_attempts, total_time} = m_d
                    var set_data={
                        _id:mock_id._id,
                        mock_name:mock_id.mock_exam_name,
                        mock_exam_description:mock_id.mock_exam_description,
                        time_limit:total_time,
                        mock_attempts:mock_attempts,
                        mock_no_of_items:mock_no_of_items
                    }
                    set_array.push(set_data)
                })
        })
        return set_array
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var map_mock = await mapMock(exam_sessions)
                res.send(200, {code: "SUCCESS", msg : "mock exam feteched", map_mock});
                
      
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}