//this api is for listing archived lessons
// API version 1
// earl

const mongoose = require('mongoose');
const lesson = require('../../../../../models/lessons.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']); 
    const
    getArchivedLesson = () => {
        return lesson.find({
                lesson_on_archive: 1
            }
        )
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    async function main() {
        try {
            var archived_lessons = await getArchivedLesson();
            if(archived_lessons.length > 0) {
                res.send(200, {code: "SUCCESS", msg : "Archived lessons retrieved.", archived_lessons});
            }
            else {
                res.send(404, {code: "NOT FOUND", msg : "No archived lessons found."});
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Lessons", e});
        }
    }

    main ();
}