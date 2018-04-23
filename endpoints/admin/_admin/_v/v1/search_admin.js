//this api is for searching of accounts   
// API version 2 
// junryl

const mongoose = require('mongoose');
const users = require('../../../../../models/user.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    const
    getAdmin = () => {
        if(_id != 0) {
            return users.find({ 
                $or:[
                    { _id: mongoose.Types.ObjectId(_id)}
                ]})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
        else {
            return users.find({ 
                $or:[
                    { first_name:{$regex: search}  },
                    { last_name:{$regex: search}  },
                    { email:{$regex: search}  }
                ]})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }
    },
    getNumberOfPages = (user_list) => {
        return Math.ceil(user_list.length / limit);
    },
    getPagedUsers = (user_list) => {
        var drop_user_list = _.drop(user_list, (limit * page) - limit);
        var take_user_list = _.take(drop_user_list, limit);
        
        return take_user_list;
    },
    searchUsers = (user_list) => {
        try {
            
            return _.filter(user_list, (element) => {
                var x = new RegExp(_.escapeRegExp(search), "i");
                //console.log("x: " + element.course_id.course_name + " - " + element.assessment_name.match(/search/g));
                return x.test(element.first_name) || x.test(element.last_name) || 
                x.test(element.email);
            });
        }
        catch(e){console.log(e);
            throw e;
        }
    },
    display = (admins) =>{
        return admins.map(admin_display => {
            const {
                _id, first_name,last_name,birthdate,email, 
                contact_no,membership_type, user_img_url
             } = admin_display;
            return {
                _id, first_name,last_name,birthdate, email, 
                contact_no,membership_type, user_img_url
            };
        });
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var admins = await getAdmin();
                
                if(admins.length >0){
                    if(_id == 0) {
                        var search_users = await searchUsers(admins);
                        admins = search_users;
                    }

                    var number_of_pages = getNumberOfPages(admins);
                    var paged_questions = await getPagedUsers(admins);
                    var display_admin = await display(paged_questions);
                    res.send(200, {code: "Success", msg : "User admins retrieved", display_admin});
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
            res.send(500, {code: "Failed", msg : "An error happened while retrieving admin", e});
        }
    }

    main ();
}