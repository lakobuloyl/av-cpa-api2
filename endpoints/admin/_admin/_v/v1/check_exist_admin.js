//this api is for adding of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const user = require('../../../../../models/user');

module.exports = function(req,res,next){
//const { membership_type } = decodeToken(req.headers['x-access-token']);
const { email, username } = req.body;

const findUserIfExist = () =>{
        return user.findOne({ 
            $and :  [{     
                       $or:
                        [   
                            {   "email" : email },
                            {   "username" : username }
                        ]
                    }] 
            }
        ).then(data=>data)
        .catch(err=>{
            throw err;
        });
    };
    async function main() {
        try {
            var Users = await findUserIfExist();
            // if(membership_type === 0)
            // {
                if(Users !== null){
                    res.send(409, { code: "Conflict", message: "Account already exists." });
                }
                else{
                    res.send(200, { code: "Success", message: "Does not exist yet." });
                }
           // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // }
        } catch (e) {
            console.log(e)
                res.send(500, {code: "Failed", msg : "An error happened while validating.", e});
        }  
    }
    main();
}