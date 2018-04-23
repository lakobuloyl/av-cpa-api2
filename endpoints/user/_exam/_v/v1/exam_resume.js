
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_logs = require('../../../../../models/exam_logs');
const questions = require('../../../../../models/questions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){  
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const {log_id}= req.params
    const
    findLogs = () => {
        return exam_logs.findOne({_id:log_id,user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getQuestId = (find_logs) => {
        return questions.find({course_id:find_logs.course_id}
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapData = (get_quest_id,find_logs) =>{
        var questions_set =[]
        find_logs.session_details.forEach(element => {
           var {_id,answer,status} =element
           get_quest_id.forEach(element2 =>{
                var  {_id,  question, choices,  answer_key, explaination} = element2
                if(element._id.toString() === element2._id.toString()){
                    var to_set= { 
                        _id:_id,  
                        question:question, 
                        choices:choices,  
                        answer_key:answer_key,  
                        answer:element.answer,
                        status:element.status,
                        explaination:explaination,
                    }
                    questions_set.push(to_set)
                }
           });
       });
       return questions_set
    };
    async function main() {
        try {
            // if(membership_type === 2)
            // {
                var find_logs = await findLogs();
                var get_quest_id = await getQuestId(find_logs);
                var shuffled = await mapData(get_quest_id,find_logs)
                res.send(200, {code: "Success", msg : "Questionaire retrieved",shuffled });
                    
             // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // }    
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Questionaire", e});
        }
    }

    main ();
}