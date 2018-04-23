//this api is for listing archived questions 
// API version 1
// earl

const mongoose = require('mongoose');
const question = require('../../../../../models/questions.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']); 
    const
    getArchivedQuestions = () => {
        return question.find({
                questions_on_archive: 1
            }
        )
        .populate([{
            path : "course_id",
            select: "course_name"
        }, 
        {
            path : "assessment_id",
            select: "assessment_name"
        }, 
        {
            path : "lesson_id",
            select: "lesson_name"
        }]).exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    async function main() {
        try {
            var archived_questions = await getArchivedQuestions();
            if(archived_questions.length > 0) {
                res.send(200, {code: "SUCCESS", msg : "Archived questions retrieved.", archived_questions});
            }
            else {
                res.send(404, {code: "NOT FOUND", msg : "No archived questions found."});
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Questions", e});
        }
    }

    main ();
}