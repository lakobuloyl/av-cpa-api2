//this api is for display the list of accounts   
// API version 2 
// junryl

var mongoose = require('mongoose');
const users = require('../../../../../models/user.js'),
{
    
    decodeToken
}
 = require('../../../../../services/core_services');


module.exports = function(req,res,next){
    const { _id,membership_type } = decodeToken(req.headers['x-access-token']);
  
    const
    getAdmins = () => {
            return users.find({_id})
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
    },
    display = (user) =>
    {
        return user.map(admin_display => {
            const {
                first_name,
                last_name,
                birthdate,
                email, 
                contact_no,
                address,
                gender,
                username,
                membership_reg_date,
                membership_exp_date,
                user_img_url,
                plan
             } = admin_display;
            return {
                first_name,
                last_name,
                birthdate,
                email, 
                contact_no,
                address,
                gender,
                username,
                membership_reg_date,
                membership_exp_date,
                user_img_url,
                plan
            };
        });
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var user = await getAdmins();
                var display_admin = await display(user);
                if(user.length >0)
                {
                    res.send(200, {code: "Success", msg : "User retrieved", display_admin});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Users to Display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving user admins", e});
        }
    }
    main ();
}