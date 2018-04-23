//this api is for adding of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const questions = require('../../../../../models/questions.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getQuestion = () => {
        return questions.find({is_draft:1,questions_on_archive:0} )
        .populate({
            path : "lesson_id",
            select: "lesson_name is_draft"
        }).exec()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapQuestion = (get_question) =>{
        return get_question.map(question_display => {
            const {
                _id, is_draft ,lesson_id
             } = question_display;
            return {
                _id, is_draft ,lesson_id
            };
        });
    },
    editDataList = (display_question,id) =>{
        var if_true =0;
         display_question.forEach(element => {
            const {is_draft, _id, lesson_id} = element
             id.forEach(element2 =>{
                const{id} = element2 
                if(_id.toString() === id.toString()){
                    console.log(lesson_id.is_draft === false)
                    if(lesson_id.is_draft === false){
                        return questions.findByIdAndUpdate(
                            {_id:element._id  },
                            {
                                $set:{
                                    is_draft:false
                                }
                            }
                            ).
                            then(data => {
                                return data;
                            }).catch(err => {
                                throw err;
                            });
                        }
                        else{
                            if_true =1
                        }
                    }
            }); 
        });
        if(if_true ===0){
            res.send(200, {code: "Success", msg : "Questionaire Accept draft"});
        }
        else{
            sendError(res, "CONFLICT", "Some questions was not accepted because some questions's lessons are not yet accepted");
        }
    },
    
    waitForPromiseArr = (promiseArr) => {
        return Promise.all(promiseArr).
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    sendError = (res, error, msg) => {
        res.send(500, {
            code: false,
            msg,
            error
        })
};
    async function main() {
        try {
             // if(membership_type === 1)
            // {
                var get_question = await getQuestion();
                if(get_question.length > 0)
                {
                    var display_question = await mapQuestion(get_question)
                    var edit_list = await editDataList(display_question,req.body)
                    
                   
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