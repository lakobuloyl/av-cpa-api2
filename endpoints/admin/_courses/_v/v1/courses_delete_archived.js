//this api is for displaying archived admins   
// API version 1
// earl
//TO BE REMOVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mongoose = require('mongoose'),
course = require('../../../../../models/course'),
assessment = require('../../../../../models/assessment'),
lesson = require('../../../../../models/lessons'),
question = require('../../../../../models/questions'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const getCourse = (course_id) => {
        return course.findById(course_id).
        then(data => data).catch(err => {
            throw err;
        });
    },
    removeAssessments = (course_id) =>
    {
        assessment.remove({course_id: course_id}).
        then(data => data).catch(err => {
            throw err;
        });
    },
    removeLessons = (course_id) =>
    {
        lesson.remove({course_id: course_id}).
        then(data => data).catch(err => {
            throw err;
        });
    },
    removeQuestions = (course_id) =>
    {
        question.remove({course_id: course_id}).
        then(data => data).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var get_course = await getCourse(req.params._id);

                if(get_course.course_on_archive) {
                    await removeAssessments(get_course._id);
                    await removeLessons(get_course._id);
                    await removeQuestions(get_course._id);

                    await course.remove(get_course);
                    res.send(200, {code: "SUCCESS", msg: "Successfully removed course.", get_course});
                }
                else {
                    res.send(409, {code: "CONFLICT", msg : "Cannot delete. Course is not archived."});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid account access."} );
            }
        }
        catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived courses ", e});
        }  
    }
    main();
}