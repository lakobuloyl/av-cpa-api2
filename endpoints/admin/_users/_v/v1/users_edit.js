//this api is for adding of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js');

module.exports = function(req,res,next){
 //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {_id} = req.params
    const
    getUser = () => {

        return users.findById({_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },

    updateUser = (user) => {
        Object.keys(req.body).
        forEach(key => {
            user[key] = req.body[key];
        });
    return user;
    },

    saveUser = (user) => {
        return user.save().
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    }
    
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var user = await getUser();
                var user_update = await updateUser(user);
                var new_user = await saveUser(user_update);

                res.send(200, {code: "Success", msg : "User successfully updated", new_user});
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while updating user", e});
        }
    }

    main ();
}