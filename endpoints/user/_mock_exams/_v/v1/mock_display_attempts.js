//this api is for displaying course metrics by id
// API version 1
// Earl

const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const exam_logs = require('../../../../../models/exam_logs'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){ 
    const { _id, membership_type } = decodeToken(req.headers['x-access-token']);
    const { mock_exam_id } = req.params;
    
    const
    getExamLogs = () => {
            return exam_logs.find({
                user_id: _id,
                mock_exam_id: mock_exam_id,
                exam_mode: "Mock exam"
            }).sort({
                exam_date: 1
            }).populate({
                path:'course_id',
                select:'course_name'
            }).then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    mapExamLogs = (get_logs) => {
        return get_logs.map(element => {
            var { _id, exam_name, total, correct, incorrect, skipped, flagged, duration, exam_date, exam_mode, mock_exam_id, course_id} = element;
            var grade = Math.round(correct / total * 100);

            return { _id, exam_name, total, correct, incorrect, skipped, flagged, duration, exam_date, exam_mode, grade};
        });
    };

    async function main() {
        try {
            var get_exam_logs = await getExamLogs();
            var map_exam_logs = await mapExamLogs(get_exam_logs);

            res.send(200, {code: "Success", msg : "Attempt list successfully fetched.", map_exam_logs});
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam logs.", e});
        }
    }

    main ();
}