//this api is for editing of assessment   
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_sessions = require('../../../../../models/exam_sessions');
const lessons = require('../../../../../models/lessons.js');
const questions = require('../../../../../models/questions.js');
const _ = require('lodash');
const assessment = require('../../../../../models/assessment.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
const { membership_type, _id } = decodeToken(req.headers['x-access-token']); 
    const assessment_id = req.params._id;
    const
    getAssessment = () => {
        //console.log(_id, assessment_id);
        return assessment.findOne({
            _id: assessment_id,
            assessment_on_archive: false,
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getExamSessions = () => {
        return exam_sessions.find({}).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateAssessment = (assessments) => {
        Object.keys(req.body).
        forEach(key => {
            assessments[key] = req.body[key];
        });
        return assessments;
    },

    saveAssessment = (assessments) => {
        return assessments.save().
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    updateLowerObjects = (c_id) => {
        lessons.updateMany(
            { assessment_id: assessment_id },
            { $set: { course_id: c_id } }
        ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

        questions.updateMany(
            { assessment_id: assessment_id },
            { $set: { course_id: c_id } }
        ).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
        //console.log(assessment_id, c_id);
    },
    checkIfUsed = (sessions, c_id) => {
        var map_sessions = _.map(sessions, (element) => {
            var is_used = 0;
            //console.log(" === " + c_id.toString());
            _.forEach(element.session_details, (element2) => {
                //console.log(element2.course_id.toString() + " === " + c_id.toString());
                if(element2.course_id.toString() === c_id.toString()) {
                    is_used = 1;
                }
            });

            return is_used;
        });

        //console.log("before: " + map_sessions);
        _.remove(map_sessions, (element) => {
            return element === 0;
        });
        //console.log("after: " + map_sessions);

        return map_sessions.length;
    };
    async function main() {
        try {
            if(membership_type === 0 || membership_type === 1) {
                var assessments = await getAssessment();

                if(assessments) {
                    var exam_session = await getExamSessions();

                    if(assessments.is_draft == false) { //IF PUBLISHED YUNG ASSESSMENT TO BE EDITED
                        var is_used = await checkIfUsed(exam_session, assessments.course_id);

                        if(is_used > 0) {
                            res.send(403, {code: "FORBIDDEN", msg : "Assessment cannot be edited"});
                        }
                        else {
                            if(req.body.course_id.toString() !== assessments.course_id.toString()) {
                                //console.log("not same2");
                                await updateLowerObjects(assessments.course_id);
                            }
                            var assessment_update = await updateAssessment(assessments);
                            var new_assessment = await saveAssessment(assessment_update);
                            res.send(200, {code: "Success", msg : "Assessment successfully updated", new_assessment});
                        }
                    }
                    else { //IF DRAFT YUNG ASSESSMENT TO BE EDITED
                        if(req.body.is_draft === 0 && membership_type === 1) {
                            res.send(403, {code: "FORBIDDEN", msg : "Assessment cannot be edited"});
                        }
                        else {
                            if(req.body.course_id.toString() !== assessments.course_id.toString()) {
                                await updateLowerObjects(assessments.course_id);
                                //console.log("not same");
                            }

                            var assessment_update = await updateAssessment(assessments);
                            var new_assessment = await saveAssessment(assessment_update);
                            res.send(200, {code: "Success", msg : "Assessment successfully updated", new_assessment});
                        }
                    }
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "Assessment not found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            }  
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while updating assessment", e});
        }
    }

    main ();
}