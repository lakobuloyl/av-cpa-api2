//this api is for ``
// API version 2 
// junryl

const mongoose = require('mongoose');
const wishlist = require('../../../../../models/wishlist');
const exam_session = require('../../../../../models/exam_sessions');
const {   decodeToken} = require('../../../../../services/core_services');
var _ = require('lodash');

module.exports = function(req,res,next){
    const { _id } = decodeToken(req.headers['x-access-token']);
    
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    const
    getWishList = () => {
        return wishlist.findOne({user_id:_id})
        .populate({
            path:'wish_list.course_id',
            select:'course_name course_image course_desc subscription_plans'
            //select:'course_name course_image course_desc course_pricing'
            })
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getSessions = () => {
        return exam_session.findOne({user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    mapWishlist = (get_wishlist , exam_session) =>{
        return   get_wishlist.wish_list.map(w_l=>{
            var {course_id } = w_l
            var status = 0;
            var progress = 0;
            var expiration = null;
            if(exam_session){
                exam_session.session_details.forEach(element3 => {
                    var {course_id, un_answered, no_of_items, completion_c, is_expired, date_expiration} = element3
                    var comp_c =Math.abs(element3.no_of_items - element3.un_answered);
                    var compute_c = Math.round((comp_c/ element3.no_of_items)*100);
                    
                    progress = compute_c
                    //console.log("_id: " + w_l);
                    if(element3.course_id.toString() === w_l.course_id._id.toString()){
                        if(element3.is_expired === true){
                            status = 2
                        }else{
                            status =1
                        }
                        expiration = element3.date_expiration;
                    }
                });
            }
            var _id = course_id._id;
            var course_name = course_id.course_name;
            var course_image = course_id.course_image;  
            var subscription_plans = course_id.subscription_plans;  
            //var course_pricing = course_id.course_pricing;  
            var course_desc = course_id.course_desc;  
            

           return { _id, course_name ,course_image ,course_desc ,subscription_plans , status , progress, expiration}
           // return { _id, course_name ,course_image ,course_desc ,course_pricing , status , progress, expiration}
       })
    },
    getNumberOfCourses = (get_wishlist) => {
        return Math.ceil(get_wishlist.wish_list.length / limit);
    },
    getPagedCourses = (map_wish) => {
        var drop_course = _.drop(map_wish, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        _.pull(take_course, undefined);
        //console.log(take_course);
        if(take_course.length > 0) {
            return take_course;
        }
        else {
            return [];
        }
    };
    async function main() {
        try {
            var get_wishlist = await getWishList();
            var exam_session = await getSessions()
            if(get_wishlist.wish_list.length > 0 ){
                var number_pages = await getNumberOfCourses(get_wishlist);
                var map_wish = await mapWishlist(get_wishlist, exam_session)
                var data_res = await getPagedCourses(map_wish)
                res.send(200, {code: "SUCCESS", msg : "wishlist successfully fetched", data_res, number_pages });
            }else{
                 res.send(200, {code: "NOT FOUND", msg : "No wishlist to display", });
            }
               
             
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving lessons", e});
        }
    }

    main ();
}