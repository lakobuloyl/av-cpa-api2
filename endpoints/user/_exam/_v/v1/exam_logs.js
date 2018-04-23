//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const _ = require('lodash');
const exam_logs = require('../../../../../models/exam_logs'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req, res, next) {
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
    const { exam_mode, study_mode, mock_mode } = req.body;
    
    const
    getSession = () => {
        return exam_logs.find({user_id:_id})
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
    getExamModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Exam Mode"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getStudyModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Study Mode"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getMockModes = () => {
        return exam_logs.find({
            user_id: _id,
            exam_mode: "Mock exam"
        }).populate({
            path:'course_id',
            select:'course_name'
        }).then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getMergedModes = (exam_modes, study_modes, mock_modes) => {
        return _.concat(exam_modes, study_modes, mock_modes);
    };
    async function main() {
        try {
            var exam_modes = [], study_modes = [], mock_modes = [];

            if(exam_mode) {
                exam_modes = await getExamModes();
            }

            if(study_mode) {
                study_modes = await getStudyModes();
            }

            if(mock_mode) {
                mock_modes = await getMockModes();
            }

            var merged_modes = await getMergedModes(exam_modes, study_modes, mock_modes);
                //var exam_sessions = await getSession();
                    res.send(200, {code: "Success", msg : "logs successfully fetched", merged_modes}); 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}