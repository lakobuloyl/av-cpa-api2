//this api is for listing archived assessments
// API version 1
// earl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']); 
    const
    getArchivedAssessment = () => {
        return assessment.find({
                assessment_on_archive: 1
            }
        )
        .populate({
            path : "course_id",
            select: "course_name"
        }).exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    async function main() {
        try {
            var archived_assessments = await getArchivedAssessment();
            if(archived_assessments.length > 0) {
                res.send(200, {code: "SUCCESS", msg : "Archived assessments retrieved.", archived_assessments});
            }
            else {
                res.send(404, {code: "NOT FOUND", msg : "No archived courses found."});
            }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Assessments", e});
        }
    }

    main ();
}