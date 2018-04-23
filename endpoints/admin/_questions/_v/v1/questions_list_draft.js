//this api is for adding of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const questions = require('../../../../../models/questions.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getQuestion = () => {
        return questions.find({is_draft:true,questions_on_archive:0} )
        .populate({
            path : "lesson_id",
            select: "lesson_name"
        }).exec()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
             // if(membership_type === 1)
            // {
                var get_question = await getQuestion();
                if(get_question.length > 0)
                {
                    res.send(200, {code: "Success", msg : "Questionaire retrieved",get_question});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Questionaire not found"}); 
                }
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