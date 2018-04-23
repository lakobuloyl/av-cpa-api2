// This API is for putting mock exams to archive.
// API version 1 
// Earl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
 const exam_session = require('../../../../../models/exam_sessions');
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
    courseInSession = (mock_exams) => {
        return exam_session.findOne({
            session_details:{
                $elemMatch:{
                    course_id:mock_exams.course_id
                }
            }
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    /*getQuestionList = (found_mock_exam) => {
        return found_mock_exam.question_list;
    },*/
    archiveMockExams = () => {
        return mock_exam.findOneAndUpdate({_id:req.params.mock_id, is_archived: false },
            {$set:{
                is_draft:1
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
                    var in_session = await courseInSession(mock_exams);
                    if(in_session){
                        res.send(409, { code: "CONFLICT", msg: "mock exams can't be move to draft, Users are already accessing this mock exam" });
                    }else{
                        await archiveMockExams();
                        res.send(200, { code: "SUCCESS", msg: "mock exams successfully move to draft" });
                    }
                }else {
                    res.send(404, {code: "NOT FOUND", msg : "No mock exams to display"});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid Account Access" });
            }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while displaying questions per mock exam.", e});
        }
    }

    main();
}