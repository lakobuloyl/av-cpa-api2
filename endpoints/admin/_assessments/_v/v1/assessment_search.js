//this api is for search of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const assessment = require('../../../../../models/assessment.js');
const course = require('../../../../../models/course.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getAssessment = () => {
        if(membership_type === 0) {
            if(is_draft === 2) {
                if(_id != 0) {
                    return assessment.find({
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], assessment_on_archive:0
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
                        assessment_on_archive:0
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
            }
            else {
                if(_id != 0) {
                    return assessment.find({
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        assessment_on_archive: 0,
                        is_draft: is_draft
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
                        assessment_on_archive:0,
                        is_draft: is_draft
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
            }
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;

            if(is_draft === 2) {
                if(_id != 0) {
                    return assessment.find({
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], assessment_on_archive:0,
                        created_by: user_id
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
                        assessment_on_archive:0,
                        created_by: user_id
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
            }
            else {
                if(_id != 0) {
                    return assessment.find({
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        assessment_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
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
                        assessment_on_archive:0,
                        is_draft: is_draft,
                        created_by: user_id
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
            }
        }
    },
    getAssessmentsByUser = (assessments) => {
        const user_id = decodeToken(req.headers['x-access-token'])._id;
        if(membership_type === 1) {
            return _.filter(assessments, (element) => {
                return element.created_by.toString() === user_id.toString();
            });
        }
        else {
            return assessments;
        }
    },
    searchAssessments = (assessments) => {
        return _.filter(assessments, (element) => {
            var x = new RegExp(_.escapeRegExp(search), "i");
            return x.test(element.course_id.course_name) || x.test(element.assessment_name);
        });
    },
    getNumberOfPages = (assessments) => {
        return Math.ceil(assessments.length / limit);
    },
    getPagedAssessment = (assessments) => {
        var drop_assessment = _.drop(assessments, (limit * page) - limit);
        var take_assessment = _.take(drop_assessment, limit);
        
        return take_assessment;
    },
    mapAssessments = (assessments) => {
        return assessments.map(assessments_display => {
            const {
                _id, assessment_name, assessment_desc, course_id, is_draft
             } = assessments_display;

            var status;
            if(is_draft) {
                status = "Draft";
            }
            else {
                status = "Published";
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
                var assessments = await getAssessment();
                var assessments_by_user = await getAssessmentsByUser(assessments);
                assessments = assessments_by_user;
                
                if(assessments.length >0){
                    if(_id == 0) {
                        var search_assessments = await searchAssessments(assessments);
                        assessments = search_assessments;
                    }
                    
                    var number_of_pages = getNumberOfPages(assessments);
                    var paged_assessments = await getPagedAssessment(assessments);
                    var map_assessments = mapAssessments(paged_assessments);
                    res.send(200, {code: "Success", msg : "Assessments retrieved", number_of_pages, map_assessments});
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