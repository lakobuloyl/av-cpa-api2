
//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const mock_exam = require('../../../../../models/mock_exam');
var _ = require('lodash');
const { decodeToken } = require('../../../../../services/core_services');
module.exports = function(req,res,next){ 
    const
    getSession = () => {
        return mock_exam.findById({_id:req.params.m_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };
    async function main() {
        try {
            var exam_sessions = await getSession();
                res.send(200, {code: "SUCCESS", msg : "mock exam feteched", exam_sessions});
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}