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
    const { membership_type } = decodeToken(req.headers['x-access-token']);   
    const {_id} = req.params
    const
    getUser = () => {
        return users.findById({_id,membership_type:1,user_on_archive:0})
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
                $set:{user_on_archive :1 }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };
    async function main() {
        //kulang pa nung user deductables
        try { 
            var user = await getUser();
            if(membership_type === 0)
            {
                if(user !== null){
                    var user_update = await removeUser(user); 
                        res.send(200, {code: "Success", msg : "Admin successfully moved to archive"});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "Admin not Found"});
                }
            }
            else{
                res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            }   
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while updating Admin", e});
        }
    }

    main ();
}