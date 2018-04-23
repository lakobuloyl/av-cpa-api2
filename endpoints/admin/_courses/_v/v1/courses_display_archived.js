//this api is for listing archived courses
// API version 1
// earl

const mongoose = require('mongoose');
const course = require('../../../../../models/course.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']); 
    const
    getArchivedCourse = () => {
        return course.find({
                course_on_archive: 1
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
            var archived_courses = await getArchivedCourse();
            if(archived_courses.length > 0) {
                res.send(200, {code: "SUCCESS", msg : "Archived courses retrieved.", archived_courses});
            }
            else {
                res.send(404, {code: "NOT FOUND", msg : "No archived courses found."});
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Courses", e});
        }
    }

    main ();
}