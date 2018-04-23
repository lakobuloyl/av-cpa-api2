//this api is for changing of password   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js'),
{
    generateRandomPassword,
    hashPassword
}
 = require('../../../../../services/core_services'),
{
    changePassword,
    sendEmail
}
 = require('../../../../../services/email_utils');
var bcrypt = require('bcryptjs');
module.exports = function(req,res,next){
    var {email} = req.body
    const
        ifAccountExist = () => {
            return users.findOne({
                email:email
            }).then(data=>data)
            .catch(err=>{
                throw err;
            });
        },
        hashPass = (hashed_pass) => {
            return hashPassword(hashed_pass).
            then(data=>data)
            .catch(err=>{
                throw err;
            });
        },
        updatePassword = (hashed_pass,if_exist) => {
            return users.findByIdAndUpdate(
                {_id:if_exist._id},
                {
                    $set:
                    {
                        password:hashed_pass
                    }
                }
            )
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        };
    async function main() {
        try {
             var if_exist = await ifAccountExist();
                if(if_exist){ /// if user exist
                    var hashed_pass = await generateRandomPassword(7)
                    var hash_pass = await hashPass(hashed_pass)
                            var update_password = await updatePassword(hash_pass,if_exist);
                            // for send grid
                            var company_email = "Pinoy_Review_Center@appventure.com"
                            var name = if_exist.first_name+" "+if_exist.last_name;
                            var email = if_exist.email
                            var template = await changePassword(name,hashed_pass)
                            sendEmail(company_email, email, "Forgot Password Request", template);
                            res.send(200, {code: "Success", msg : "user successfully changed Password"});
                }
                else{
                    res.send(404,{code:"NOT FOUND", message:"Account not Found"});
                }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating admin", e});
        }
    }

    main ();
}