//this api is for changing of password   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js'),
{
    hashPassword
}
 = require('../../../../../services/core_services'),
{
    changePasswordAdmin,
    sendEmail
}
 = require('../../../../../services/email_utils'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
var bcrypt = require('bcryptjs');
module.exports = function(req,res,next){

    const { _id, membership_type } = decodeToken(req.headers['x-access-token']);
    var {pass, newpass1, newpass2} = req.body
    const
        ifAccountExist = () => {
            return users.findById({ _id:_id })
            .then(data=>data)
            .catch(err=>{
                throw err;
            });
        },
        comparePassword = (user,pass) =>{
            return decode_pass = bcrypt.compare(pass, user.password).
            then(data => data).catch(err => err);
        },
        hashPass = (newpass2) => {
            return hashPassword(newpass2).
            then(data=>data)
            .catch(err=>{
                throw err;
            });
        },
        updatePassword = (hash_pass) => {
            return users.findByIdAndUpdate(
                {_id:_id},
                {
                    $set:
                    {
                        password:hash_pass
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
             // if(membership_type === 2)
            // {
             var if_exist = await ifAccountExist();
                if(if_exist && membership_type !==2) /// if user exist
                {
                    var compare_password = await comparePassword(if_exist, pass);
                    if(compare_password) /// if password match old password in database
                    {
                        if(newpass1 === newpass2) // if passowrd 1 and password 2 matched
                        {
                            var hash_pass = await hashPass(newpass2)
                            var update_password = await updatePassword(hash_pass);

                            // for send grid
                            var company_email = "Pinoy_Review_Center@appventure.com"
                            var name = if_exist.first_name+" "+if_exist.last_name;
                            var template = await changePasswordAdmin(name,newpass2)
                            var email = if_exist.email
                            sendEmail(company_email, email, "Admin Password Changed", template);

                            res.send(200, {code: "Success", msg : "Admin successfully changed Password"});
                        }
                        else{
                            res.send(409,{code:"CONFLICT", message:"New Password not match"});
                        }
                    }
                    else{
                        res.send(409,{code:"CONFLICT", message:"Old password not match"});
                    }
                }
                else{
                    res.send(404,{code:"NOT FOUND", message:"Account not Found"});
                }

            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating admin", e});
        }
    }

    main ();
}