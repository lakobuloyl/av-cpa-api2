//this api is for adding bulk of questions
// API version 1

const mongoose = require('mongoose');
const _ = require('lodash');
const csvtojson = require("csvtojson");
const questions = require('../../../../../models/questions.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { _id, membership_type } = decodeToken(req.headers['x-access-token']);
    const { course_id, assessment_id, lesson_id } = req.body;
    
    const readRows = csv => {
        csvtojson().fromFile(csv).on("json", async csvRow => {
            var question = csvRow.QUESTION;
            //var is_draft = csvRow.IS_DRAFT;
            var is_draft = 1;
            var choices = [], explaination = [];
            var answer_key = csvRow.ANSWER;
            var time_limit = csvRow.ESTIMATED_TIME;
            var created_by = _id;

            choices.push(csvRow.CHOICE_1);
            choices.push(csvRow.CHOICE_2);
            choices.push(csvRow.CHOICE_3);
            choices.push(csvRow.CHOICE_4);
            choices.push(csvRow.CHOICE_5);

            explaination.push(csvRow.EXPLANATION_1);
            explaination.push(csvRow.EXPLANATION_2);
            explaination.push(csvRow.EXPLANATION_3);
            explaination.push(csvRow.EXPLANATION_4);
            explaination.push(csvRow.EXPLANATION_5);

            //_.pull(choices, '');
            //_.pull(explaination, '');

            var question_data = { course_id, assessment_id, lesson_id, question, choices, 
                explaination, answer_key, time_limit, is_draft, created_by };

            //console.log(question_data);

            var new_question = await questions.create(question_data).
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });            
        }).on("done", error => {
            if(error) {
                console.log(error);
            }
        });
      };
    async function main() {
        try {
            if(req.files) {
                //console.log(req.files);
                const rows = readRows(req.files.csv_file.path);
                res.send(201, {code: "Success", message: "Questions successfully added."});
            }
            else {
                res.send(409, {code: "Failed", message: "There is no file sent."});
            }            
        } 
        catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error occured when creating questions.", e});
        }
    }
    main ();
}