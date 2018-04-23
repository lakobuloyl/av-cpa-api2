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
    ``
    const
    getAllMockExams = () => {
        return mock_exam.find({ is_archived: false }).
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    /*getQuestionList = (found_mock_exam) => {
        return found_mock_exam.question_list;
    },*/
    archiveMockExams = (all_mock_exams, mock_exams_to_remove) => {
        var list = [];
        
        _.forEach(all_mock_exams, (element) => {
            _.forEach(mock_exams_to_remove, (element2) => {
                if(element._id.toString() === element2._id.toString()) {
                    mock_exam.findByIdAndUpdate( { _id: element._id.toString() },
                    { $set: { is_archived: true } } ).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });;
                }
            });
            
        });
        
        return list;
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var all_mock_exams = await getAllMockExams();
                //console.log(mock_exams_to_archive + " - " + all_mock_exams);
                if(all_mock_exams !== null) {
                    var mock_exams_to_archive = req.body;
                    
                    await archiveMockExams(all_mock_exams, mock_exams_to_archive);

                    res.send(200, { code: "SUCCESS", msg: "Archived mock exams" });
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "No mock exams to display"});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", msg: "Invalid Account Access" });
            }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while removing mock exam.", e});
        }
    }

    main();
}