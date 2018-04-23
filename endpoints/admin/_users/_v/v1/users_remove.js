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

    removeUser = (user) => {
        return users.findByIdAndUpdate(
            {_id},
            {
                $set:
                {
                    user_on_archive :1
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
            // if(membership_type === 1)
            // {
                var user = await getUser();
                if(user !== null)
                {
                    var user_update = await removeUser(user); 
                    res.send(200, {code: "Success", msg : "User successfully moved to archive"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "User not Found"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating user", e});
        }
    }

    main ();
}