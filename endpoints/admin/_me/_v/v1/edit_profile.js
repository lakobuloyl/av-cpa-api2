//this api is for adding of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js'),
{
    
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
const {_id, membership_type } = decodeToken(req.headers['x-access-token']);

const
    getAdmin = () => {

        return users.findById({_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    updateAdmin = (admin) => {
        Object.keys(req.body).
        forEach(key => {
            admin[key] = req.body[key];
        });
    return admin;
    },
    saveAdmin = (admin) => {
        return admin.save().
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
                var admin = await getAdmin();
                if(admin)
                {
                    var admin_update = await updateAdmin(admin);
                    var new_admin = await saveAdmin(admin_update);
                    res.send(200, {code: "Success", msg : "Your profile has been successfully updated"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Account not found"});
                }
           // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while updating your profile", e});
        }
    }

    main ();
}