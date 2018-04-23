//this api is for displaying archived admins   
// API version 1
// earl
//TO BE REMOVED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const getAssessment = (assessment_id) => {
        return assessment.findById(assessment_id).
        then(data => data).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var get_assessment = await getAssessment(req.params._id);

                if(get_assessment.assessment_on_archive) {
                    await assessment.remove(get_assessment);
                    res.send(200, {code: "SUCCESS", msg: "Successfully removed assessment." + get_assessment});
                }
                else {
                    res.send(409, {code: "CONFLICT", msg : "Cannot delete. Assessment is not archived."});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid account access."} );
            }
        }
        catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived assessments ", e});
        }  
    }
    main();
}