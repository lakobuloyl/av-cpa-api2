//this api is for adding of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const{ course_id} = req.params
    const
    getAssessment = () => {
        return assessment.find(
            {assessment_on_archive:0,
            course_id,course_id
            }
        )
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    mapAssessment = (assessments) =>
    {
        return assessments.map(assessments_display => {
            const {
                _id,
                assessment_name,
               assessment_desc
             } = assessments_display;
            return {
                _id,
                assessment_name,
                assessment_desc
            };
        });
    };

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var assessments =await getAssessment()
                if(assessments.length >0)
                {
                    var map_assessment =await mapAssessment(assessments)
                    res.send(200, {code: "Success", msg : "Assessments retrieved", map_assessment});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Assessments not found"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving Assessments", e});
        }
    }

    main ();
}