const mongoose = require('mongoose');
const users = require('../../../../../models/user.js');
const 
{
    generateAppAccessToken
} = require('../../../../../services/core_services');

var bcrypt = require('bcryptjs');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = function(req,res,next){

    const {username,pass} = req.body;

const 
    getUser = () =>
    {
        return users.findOne({username:username})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    comparePassword = (user,pass) =>
    {
    
        return decode_pass = bcrypt.compare(pass, user.password).
        then(data => data).catch(err => err);
       
    }
    generateToken = (user) => {
        return generateAppAccessToken(getPayload(user));
    },

    getPayload = (user) => {
        const { _id, email, first_name, last_name,username,membership_type } = user;
        var payload = {  _id, email, first_name, last_name,username,membership_type };
        return payload;
    },
    mapPayload = (payload_get) =>
    {
        var info = payload_get.first_name+" "+payload_get.last_name;
        var user_level = payload_get.membership_type
       return {user_level, info};
    };
  async function main (){
    try{
        var user = await getUser();
        if(user !== null){
            //ONLY UNARCHIVED USERS CAN LOG IN
            if(!user.user_on_archive) {
                if(user.membership_type === 1 || user.membership_type === 0){
                    var password = await comparePassword(user,pass);
                    if(password)
                    {
                        var access_token = await generateToken(user);
                        payload_get = await getPayload(user);
                        var map_payload = await mapPayload(payload_get);
                        res.send(200, {code: "SUCCESS", msg : "Successfylly log in",
                            map_payload,
                            access_token
                        });
                    }
                    else {
                        res.send(401, {code: "CONFLICT", msg : "incorrect password"});
                    }
                }
                else {
                    res.send(403, {code: "FORBIDDEN", msg : "Invalid User Access"});
                }  
            }
            else {
                res.send(403, {code: "FORBIDDEN", msg : "No matching user."});
            }
            
        }
        else {
            res.send(401, {code: "CONFLICT", msg : "Invalid Username"});
        }
    }
     catch (e) {
        console.log(e)
        res.send(500, {code: "Failed", msg : "An error happened while retrieving users", e});
    }
  }
  main();
};
