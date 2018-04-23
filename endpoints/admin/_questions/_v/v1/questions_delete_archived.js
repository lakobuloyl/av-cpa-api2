//this api is for displaying archived admins   
// API version 1
// earl
//TO BE REMOVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mongoose = require('mongoose');
const question = require('../../../../../models/questions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const getQuestion = (question_id) => {
        return question.findById(question_id).
        then(data => data).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var get_question = await getQuestion(req.params._id);

                if(get_question.questions_on_archive) {
                    await question.remove(get_question);
                    res.send(200, {code: "SUCCESS", msg: "Successfully removed question." + get_question});
                }
                else {
                    res.send(409, {code: "CONFLICT", msg : "Cannot delete. Question is not archived."});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid account access."} );
            }
        }
        catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived questions ", e});
        }  
    }
    main();
}