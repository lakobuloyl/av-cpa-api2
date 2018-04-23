
const mongoose = require('mongoose');
const moment = require('moment-timezone')
const users = require('../../../../../models/user.js');
const exam_session = require('../../../../../models/exam_sessions');
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
    getUser = () =>{
        return users.findOne({username:username})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    comparePassword = (user,pass) =>{
        return decode_pass = bcrypt.compare(pass, user.password).
        then(data => { 
            return data}).catch(err => err);
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
       return info;
    },
    findSessions =(user) =>{
        return exam_session.findOne({user_id:user._id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getCourseSession = (find_session) =>{
        var date_now = new Date(Date.now());
        find_session.session_details.forEach(element => {
            var { is_expired,date_expiration} = element
            if(!date_expiration.toString() === "free" ){
                 var isafter = moment(date_now.toISOString()).isAfter(date_expiration);
                if(isafter === true){
                    var dta = true;
                    element.is_expired=dta
                }
            }
           
        });
        return find_session
    }
    saveSession =(update_expiry,user) =>{
        return exam_session.findOneAndUpdate({user_id:user._id},
            {
                $set:{
                    session_details:update_expiry.session_details
                }
            }
        )
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    };
  async function main (){
    try{
        var user = await getUser();
       if(user !== null){
            if(user.membership_type === 2){
                    var password = await comparePassword(user,pass);
                    if(password){
                        var access_token = await generateToken(user);
                        payload_get = await getPayload(user);
                        var map_payload = await mapPayload(payload_get);
                        var find_session = await findSessions(user);
                        if(find_session){ // if session is exist for this user
                            var update_expiry = await getCourseSession(find_session);
                            var save_session = await saveSession(update_expiry,user)
                        }
                        res.send(200, {code: "SUCCESS", msg : "Successfylly log in",
                            payload_get,
                            access_token
                        });
                    }else{  res.send(401, {code: "CONFLICT", msg : "Invalid Username/password"});  }
                }else{   res.send(404, {code: "FORBIDDEN", msg : "Invalid user access"}); }
            }else{  res.send(401, {code: "CONFLICT", msg : "Invalid Username"});  }
       
        
    }

     catch (e) {
        console.log(e)
        res.send(500, {code: "Failed", msg : "An error happened while retrieving users", e});
        }
  }
  main();
};
