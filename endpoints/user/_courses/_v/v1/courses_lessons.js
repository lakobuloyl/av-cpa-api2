//this api is for ``
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const lessons = require('../../../../../models/lessons.js');

module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { assessment_id } = req.params;
    const

    getAssessments = () => {
       
        return assessment.find({course_id:course_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getLessons = () => {
       
        return lessons.find()
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },

    filterLessons = (lessons,assessments) => {
        var new_data =  []
        lessons.forEach( element =>{
            const {assessment_id,_id} = element
            assessments.forEach(elem=>{
                const{_id} = elem;
                // console.log(lessons.assessment_id)
                // console.log(lessons._id)
                if(assessment_id.toString() === _id.toString())
                {
                    new_data.push(lessons._id);
                }
            }); // end of assessment for each 
        });
        console.log(new_data);
    };

    async function main() {

        try {
            // if(membership_type === 2)
            // {

                var lessons = await getLessons();
                var assessments = await getAssessments();
                var  filter_lessons= await filterLessons(lessons,assessments);
                if(lessons !== null)
                {
                    res.send(200, {code: "Success", msg : "Lessons retrieved", filter_lessons});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Lessons to Display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while retrieving lessons", e});
        }
    }

    main ();
}