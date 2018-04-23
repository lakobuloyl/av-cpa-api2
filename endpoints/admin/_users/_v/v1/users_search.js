//this api is for displaying user  accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js');

module.exports = function(req,res,next){

 //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const {_id} = req.params
    const
    getUsers = () => {
        return users.findById(req.params).then(data=>data)
        .catch(err=>{
            throw err;
        });
    }

    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var users = await getUsers();
                if(users)
                {
                    res.send(200, {code: "Success", msg : "Users retrieved", users});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Users to Display"});
                }
             // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // }    
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving users", e});
        }
    }

    main ();
}