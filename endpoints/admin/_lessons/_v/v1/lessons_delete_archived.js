//this api is for displaying archived admins   
// API version 1
// earl
//TO BE REMOVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mongoose = require('mongoose');
const lesson = require('../../../../../models/lessons'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const getLesson = (lesson_id) => {
        return lesson.findById(lesson_id).
        then(data => data).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var get_lesson = await getLesson(req.params._id);

                if(get_lesson.lesson_on_archive) {
                    await lesson.remove(get_lesson);
                    res.send(200, {code: "SUCCESS", msg: "Successfully removed lesson." + get_lesson});
                }
                else {
                    res.send(409, {code: "CONFLICT", msg : "Cannot delete. Lesson is not archived."});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid account access."} );
            }
        }
        catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived lessons ", e});
        }  
    }
    main();
}