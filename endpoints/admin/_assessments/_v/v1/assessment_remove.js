//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const assessment = require('../../../../../models/assessment');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {id} = req.body
    const
    getAssessment = () => {
        return assessment.find({assessment_on_archive:false})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapAssessment = (assessment) =>{
        return assessment.map(assessment_display => {
            const {
                _id,assessment_on_archive
             } = assessment_display;
            return {
                _id,assessment_on_archive
            };
        });
    },
    editDataList = (display_assessment,id) =>{
        display_assessment.forEach(element => {
            const {is_draft, _id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){

                        assessment.findByIdAndUpdate(
                            {_id:element._id  },
                                {$set:{
                                        assessment_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });

                        lessons.updateMany(
                            {assessment_id:element._id  },
                                {$set:{
                                    lesson_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });

                        questions.updateMany(
                            {assessment_id:element._id  },
                                {$set:{
                                    questions_on_archive:true
                                    }
                                }).
                        then(data => {
                            return data;
                        }).catch(err => {
                            throw err;
                        });
                       
                    }
            }); 
        });
    };
    async function main() {
        try {
            if(membership_type === 0)
            {
                var assessment = await getAssessment();
                if(assessment !== null){
                    var display_assessment = await mapAssessment(assessment)
                    var edit_list = await editDataList(display_assessment,req.body)
                    res.send(200, {code: "Success", msg : "assessment move to archive successfully"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no assessment to display"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}