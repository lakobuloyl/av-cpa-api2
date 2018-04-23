//this api is for changing of password   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js');
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
        };
    async function main() {
        try {
             var if_exist = await ifAccountExist();
                if(if_exist){ 
                    var fullname = if_exist.first_name+" "+if_exist.last_name;
                    res.send(200, {code: "Success", msg : "Email's data fetched" ,fullname,email});
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