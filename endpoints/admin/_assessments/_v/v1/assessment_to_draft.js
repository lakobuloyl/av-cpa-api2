//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const exam_session = require('../../../../../models/exam_sessions');
 const assessment = require('../../../../../models/assessment');
 const lessons = require('../../../../../models/lessons');
 const questions = require('../../../../../models/questions');
module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getAssessment = () => {
        return assessment.findOne({_id:req.params.assess_id,assessment_on_archive:false})
        .populate({
            path:'course_id',
            select:'course_name'
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    sessionExist = (get_assessment) => {
        return exam_session.findOne({
            session_details:{
                $elemMatch:{
                    course_id:get_assessment.course_id._id
                }
            }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    editDataList = () =>{
        assessment.findByIdAndUpdate( {_id:req.params.assess_id  },
            {$set:{
                 is_draft:true
                }
            }).
            then(data => {return data; })
            .catch(err => { throw err;});
            
        lessons.updateMany({assessment_id:req.params.assess_id  },
            {$set:{
                is_draft:true
            }
            })
            .then(data => {return data;})
            .catch(err => { throw err; });

        questions.updateMany({assessment_id:req.params.assess_id },
            {$set:{
                is_draft:true
            }
            })
            .then(data => {return data;  })
            .catch(err => { throw err;});
                       
    };
    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1 ){
                var get_assessment = await getAssessment();
                if(assessment){
                    var in_session = await sessionExist(get_assessment);
                    if(in_session){
                        res.send(409, {code: "CONFLICT", msg : "Assessment can't move to Draft. Users are already accessing this Assessments "});
                    }else{
                        var edit_list = await editDataList()
                        res.send(200, {code: "Success", msg : "assessment move to draft successfully"});
                    }
                }else{
                    res.send(404, {code: "NOT FOUND", msg : "Assessment not found"});
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