// This API is for putting mock exams to archive.
// API version 1 
// Earl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
const question = require('../../../../../models/questions.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getMockExams = () => {
        return mock_exam.findOne({_id:req.params.mock_id, is_archived: false }).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    acceptMockExams = () => {
        return mock_exam.findOneAndUpdate({_id:req.params.mock_id, is_archived: false },
            {$set:{
                is_draft:0
            }}
        ).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type !== 2) {
                var mock_exams = await getMockExams();
                if(mock_exams) {
                    await acceptMockExams();
                    res.send(200, { code: "SUCCESS", msg: "mock exams successfully move to published" });
                }else {
                    res.send(404, {code: "NOT FOUND", msg : "No mock exams to display"});
                }
            } else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid Account Access" });
            }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while displaying questions per mock exam.", e});
        }
    }

    main();
}