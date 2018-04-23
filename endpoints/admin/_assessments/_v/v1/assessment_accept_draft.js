//this api is for adding of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']); 
    const
    getAssessment = () => {
        return assessment.find({
                is_draft:true,
                assessment_on_archive:0
            }
        )
        .populate({
            path : "course_id",
            select: "course_name is_draft"
        }).exec()
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
    mapAssess = (assess) =>{
        return assess.map(assess_display => {
            const {
                _id,assessment_name,assessment_desc, is_draft,course_id
             } = assess_display;
            return {
                _id,assessment_name,assessment_desc, is_draft,course_id
            };
        });
    },
    editDataList = (display_assess,id) =>{
        var if_true = 0;
        display_assess.forEach(element => {
            const {is_draft, _id,course_id} = element
            id.forEach(element2 =>{
                const{id} = element2 
                    if(_id.toString() === id.toString()){
                        if(course_id.is_draft === false)
                        {
                            return assessment.findByIdAndUpdate(
                            {_id:element._id  },
                                {
                                    $set:{
                                        is_draft:false
                                    }
                                }
                            ).
                            then(data => {
                                return data;
                            }).catch(err => {
                                throw err;
                            });
                        }
                        else{
                            if_true =1;
                        }
                        
                    }
            }); 
        });
        if(if_true ===0){
            res.send(200, {code: "Success", msg : "assessment Accept draft"});
        }
        else{
            sendError(res, "CONFLICT", "Some assessments was not accepted because some its course are not yet accepted");
        }
    },
    sendError = (res, error, msg) => {
        res.send(500, {
            code: 403,
            msg,
            error
        })
    };
    async function main() {
        try {
            if(membership_type === 0) {
                var assess = await getAssessment();
                if(assess.length > 0 ){
                    var display_assess = await mapAssess(assess)
                    var edit_list = await editDataList(display_assess,req.body)
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no assess to display"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no assess to display", e});
        }
    }

    main ();
}