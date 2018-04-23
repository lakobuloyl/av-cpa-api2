//this api is for edditing of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){
   const { membership_type } = decodeToken(req.headers['x-access-token']);
  const {_id} = req.params
    const
        ifAccountExist = () => {
            return users.findById({
            _id:_id,user_on_archive:0
            }).then(data=>data)
            .catch(err=>{
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
        };
    async function main() {
        try {
            if(membership_type === 0)
            {
                var if_exist = await ifAccountExist();
                
                if(if_exist){
                    var admin_update = await updateAdmin(if_exist);
                    var new_admin = await saveAdmin(admin_update);
                        res.send(200, {code: "Success", msg : "Admin successfully updated"});
                }
                else{
                    res.send(404,{code:"NOT FOUND", message:"Account not Found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            }
         }
         catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating admin", e});
        }
    }

    main ();
}