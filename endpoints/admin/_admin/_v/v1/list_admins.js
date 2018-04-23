//this api is for display the list of accounts   
// API version 2 
// junryl

var mongoose = require('mongoose');
const users = require('../../../../../models/user.js');
const _ = require('lodash');
module.exports = function(req,res,next){
    //const { membership_type } = decodeToken(req.headers['x-access-token']);
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    const
    getAdmins = () => {
        return users.find({
            user_on_archive:0,
            membership_type:req.body.membership_type
            })
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
    display = (admins) =>{
        return admins.map(admin_display => {
            const { _id,
                first_name,last_name,birthdate,email, 
                contact_no,membership_type,user_img_url
             } = admin_display;
            return { _id,
                first_name,last_name,birthdate,email, 
                contact_no,membership_type, user_img_url
            };
        });
    };
    async function main() {
        try {
            var admins = await getAdmins();
            // if(membership_type === 1)
            // {
                var display_admin = await display(admins);
                if(admins.length >0) {
                    var number_of_pages = getNumberOfPages(display_admin); 
                    var paged_users = await getPagedUsers(display_admin);
                    
                   
                    res.send(200, {code: "Success", msg : "User admins retrieved", number_of_pages, paged_users});
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