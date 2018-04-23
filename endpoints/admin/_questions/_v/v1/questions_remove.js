//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {id} = req.body
    const
    getQuestions = () => {
        return questions.find({questions_on_archive:false})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapQuestions = (question) =>{
        return question.map(question_display => {
            const {
                _id,questions_on_archive
             } = question_display;
            return {
                _id,questions_on_archive
            };
        });
    },
    editDataList = (display_question,id) =>{
        display_question.forEach(element => {
            const {is_draft, _id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                        questions.findByIdAndUpdate(
                            {_id:element._id  },
                                {$set:{
                                    questions_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });
                }
            }); 
        });
    };
    async function main() {
        try {
            if(membership_type === 0)
            {
                var question = await getQuestions();
                if(question !== null){
                    var display_question = await mapQuestions(question)
                    var edit_list = await editDataList(display_question,req.body)
                    res.send(200, {code: "Success", msg : "question move to archive successfully"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no question to display"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}