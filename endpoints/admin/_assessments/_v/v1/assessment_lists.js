//this api is for adding of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');;

module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']); 
    const { course_by } = req.body;
    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getAllAssessments = () => {
        if(membership_type === 0) {
            return assessment.find({
                assessment_on_archive: 0
            }).sort({ is_draft: -1 }).
            populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
        else {
            return assessment.find({
                assessment_on_archive: 0,
                created_by: _id
            }).sort({ is_draft: -1 }).
            populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
        
    },
    getAssessmentsByDraft = (assessments) => {
        if(is_draft === 2) {
            return assessments;
        }
        else {
            return assessment.find({
                assessment_on_archive: 0,
                is_draft: is_draft
            }).populate({
                path : "course_id",
                select: "course_name"
            }).exec()
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
        }
    },
    getAssessmentsByCourse = (assessments) => {
        if(course_by) {
            return _.filter(assessments, (element) => {
                return element.course_id._id == course_by;
            });
        }
        else {
            return assessments;
        }
    },
    getPagedAssessment = (assessments) => {
        var drop_assessment = _.drop(assessments, (limit * page) - limit);
        var take_assessment = _.take(drop_assessment, limit);
        
        return take_assessment;
    },
    getNumberOfPages = (assessments) => {
        return Math.ceil(assessments.length / limit);
    },
    mapAssessments = (assessments) => {
        return assessments.map(assessments_display => {
            var {
                _id, assessment_name, assessment_desc, course_id, is_draft
            } = assessments_display;

            if(is_draft) {
                var status = "Draft";
            }
            else {
                var status = "Published";
            }

            return {
                _id, assessment_name, assessment_desc, course_id, status
            };
        });
    };
    
    async function main() {
        try {
             // if(membership_type === 1)
            // {
                var assessments = await getAllAssessments();
                //console.log(assessments);

                if(assessments.length > 0){
                    var assessments_by_draft = await getAssessmentsByDraft(assessments);
                    var assessments_to_page = assessments_by_draft;

                    if(assessments_by_draft.length > 0) {
                        if(course_by) {
                            var assessments_by_course = await getAssessmentsByCourse(assessments_by_draft);
                            assessments_to_page = assessments_by_course;
                        }

                        if(assessments_to_page.length > 0) {
                            var number_of_pages = getNumberOfPages(assessments_to_page);
                            var paged_assessments = await getPagedAssessment(assessments_to_page);
                            var map_assessments = await mapAssessments(paged_assessments);
                            
                            res.send(200, {code: "Success", msg : "Assessments retrieved", number_of_pages, map_assessments});
                        }
                        else {
                            res.send(404, {code: "NOT FOUND", msg : "Assessments not found"});
                        }
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "Assessments not found"});
                    }
                }
                else {
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