
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
        return exam_mock_session.findOne({user_id:_id})
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapSession = (exam_sessions) =>{
        var unanswered = incorrect = correct = 0;
        var is_exist= 0;
        exam_sessions.users_mock.map(u_m=>{
            if(u_m.course_id.toString() === course_id.toString()){
                is_exist = 1
                u_m.mock_details.map(m_d=>{
                const {mock_questions} = m_d
                mock_questions.map(m_q =>{
                    var {status} = m_q
                    if(m_q.status === 0){
                        ++unanswered;
                    }else if(m_q.status ===1 ){
                        ++correct;
                    }else if(m_q.status === 2){
                        ++incorrect;
                    }
                    }) 
                })
             }
        })
        var total  = unanswered + incorrect + correct;
        var progress =((incorrect+correct)/total)*100
        return {  total,  unanswered ,incorrect ,correct, progress, is_exist}
   
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
            var map_session = await mapSession(exam_sessions)
            if(map_session.is_exist === 1){
                res.send(200, {code: "SUCCESS", msg : "mock exam feteched", map_session});
            }else{
               res.send(404, {code: "NOT FOUND", msg : "NO Data found", });
            }
            
                
      
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}