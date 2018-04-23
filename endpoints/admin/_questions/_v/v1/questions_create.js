//this api is for adding of question   
// API version 2 
// junryl

const mongoose = require('mongoose');
const questions = require('../../../../../models/questions.js'),
      course = require('../../../../../models/course.js'),
      assessment = require('../../../../../models/assessment.js'),
      lessons = require('../../../../../models/lessons.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const {_id, membership_type } = decodeToken(req.headers['x-access-token']);
    const 
    getCourse = () =>{
        return course.findOne({_id:req.body.course_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    },
    getAssessment = () =>{
        return assessment.findOne({_id:req.body.assessment_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    },
    getLesson = () =>{
        return lessons.findOne({_id:req.body.lesson_id, is_draft:true})
        .then(data =>{
            return data;
        })
        .catch(err=>{
            throw err;
        })
    },
    createQuestions = () => {
        var to_save = req.body;

        if(membership_type === 1){
            to_save.is_draft = true;
        }
        
        to_save.created_by = _id;
        //console.log("to save: " + to_save.is_draft);
        var add_question = Object.assign({}, to_save);
        return add_question;
    },
    saveData =(question) =>{
     var save_datas=    questions.create(question);
        return save_datas;
    };
    async function main() {
        try {
            var get_course = await getCourse()
            if(get_course){
                var get_assessment = await getAssessment();

                if(get_assessment) {
                    var get_lesson = await getLesson();
                    
                    if(get_lesson) {
                        var question = await createQuestions();
                        var save_data = await saveData(question);
                        res.send(200, {code: "Success", message : "Question successfully Added", questions});
                    }
                    else {
                        res.send(409,{code:"CONFLICT", message:"Cannot add. This lesson is not a draft."});
                    }
                }
                else {
                    res.send(409,{code:"CONFLICT", message:"Cannot add. This assessment is not a draft."});
                } 
            }
            else {
                res.send(409,{code:"CONFLICT", message:"Cannot add. This course is not a draft."});
            }            
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", message : "An error happened while saving Questionaire", e});
        }
    }
    main ();
}