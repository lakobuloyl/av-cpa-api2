//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
const assessment = require('../../../../../models/assessment');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getAssess = () => {
        return assessment.find({
            assessment_on_archive: 0,
            is_draft: true
        })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapAssess = (get_assess) =>
    {   
        var new_set = [];
        return  get_assess.map(assess_display => {
            const {_id,assessment_name, is_draft } = assess_display;
            
            return {_id,assessment_name, is_draft }
                
        });

    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var get_assess = await getAssess();
                if(get_assess !== null){
                    var display_assess = await mapAssess(get_assess)
                        res.send(200, {code: "Success", msg : "assessment retrieved", display_assess});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no assessment to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}