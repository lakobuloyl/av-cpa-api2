//this api is for display the list of user accounts (excluding admin users)
// API version 2 
// junryl

var mongoose = require('mongoose');
const users = require('../../../../../models/user.js');
const _ = require('lodash');

module.exports = function(req,res,next){

 //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const
    getUser = () => {
            return users.find({user_on_archive:0 }
            ) // user only 
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
    },
    getPagedUsers = (user_list) => {
        var drop_user_list = _.drop(user_list, (limit * page) - limit);
        var take_user_list = _.take(drop_user_list, limit);
        
        return take_user_list;
    },
    getNumberOfPages = (user_list) => {
        return Math.ceil(user_list.length / limit);
    },
    display = (user) =>
    {
        var data_return =[]
         user.map(user_display => {
            const {
                _id,
                first_name,
                last_name,
                email, 
                plan, 
                user_img_url,
                membership_reg_date,
                membership_type
             } = user_display;
             if(user_display.membership_type !== 0){
               var data_set =   {
                _id:_id,
                first_name:first_name,
                last_name:last_name,
                email:email, 
                user_img_url:user_img_url,
                membership_reg_date:membership_reg_date,
                membership_type:membership_type
            }
            data_return.push(data_set)
        }
            
        });
        return data_return
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var user = await getUser();
                var display_user = await display(user);
                if(user.length >0)
                {
                    var number_of_pages = getNumberOfPages(display_user);
                    var paged_users = await getPagedUsers(display_user);

                    res.send(200, {code: "Success", msg : "User retrieved", number_of_pages, paged_users});
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
            res.send(500, {code: "Failed", msg : "An error happened while retrieving user admins", e});
        }
    }
    main ();
}