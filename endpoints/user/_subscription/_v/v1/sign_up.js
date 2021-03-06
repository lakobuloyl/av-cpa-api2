//this api is for adding of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const user = require('../../../../../models/user'),
{
    hashPassword,
    decodeToken,
    generateRandomPassword
}
 = require('../../../../../services/core_services'),
 {
    newAccountCreatedTemplate,
    sendEmail
}
 = require('../../../../../services/email_utils');

module.exports = function(req,res,next){

const {first_name,last_name,email, username,password} = req.body
// const { membership_type } = decodeToken(req.headers['x-access-token']);
const

    findUserIfExist = () =>
    {
        return user.findOne(
            { 
                $and : 
                [
                    {     
                       $or:
                        [   
                            {   "email" : email },
                            {   "username" : username }
                        ]
                    } 
                   
                ] 
            }
        ).then(data=>data)
        .catch(err=>{
            throw err;
        });
    },
   
    createAccount = () =>
    {
        var add_account = Object.assign({membership_type:2}, req.body); // get all data  from body
        return add_account;
    },
    hashPass = (password) => {
        var password = password;
        return hashPassword(password).
            then(data => {
               password = data;
             return password
            }).catch(err => {
                throw err;
            })
    };
    async function main() {
        try {
            var Users = await findUserIfExist();
            // if(membership_type === 1)
            // {
                if(Users !==null){
                    
                    res.send(409,{code:"CONFLICT", message:"this account is already exist"});
                }
                else{
                        // foraccount Creation
                        var hash_pass = await hashPass(password)
                        var account_to_add = await createAccount();
                            account_to_add.password = hash_pass;
                      
                        user.create(account_to_add);
                        
                        // for send grid
                        var company_email = "Pinoy_Review_Center@appventure.com"
                        var name = first_name+" "+last_name;
                        var template = await newAccountCreatedTemplate(name,username,password)
                        var email = account_to_add.email
                            sendEmail(company_email, email, "User Account Created", template);

                            res.send(200,{code:"Success", message:"User has been created"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // }
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while saving admin", e});
        }  
    }
    main();
}