

//this api is for create package
// API version 2 
// junryl

const mongoose = require('mongoose');
const exam_session = require('../../../../../models/exam_sessions');
const _ = require('lodash');
const course = require('../../../../../models/course'),
 wishlist = require('../../../../../models/wishlist'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
module.exports = function(req,res,next){  
    const { _id } = decodeToken(req.headers['x-access-token']);

    const limit = req.body.limit || 6;
    const page = req.body.page || 1;

    const
    getCourse = () => {
    return course.find({is_draft:0,course_on_archive:0})
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
    },
    getUserCourse = () =>{
        return exam_session.find({user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        }); 
    },
    getWishlist = () =>{
        return wishlist.findOne({user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        }); 
    },
    ifOwned = (get_course, get_user_course, wish_list) =>{
        var courses = []
        var set_data ={
            _id:"",
            course_name:"",
            course_desc:"",
            course_image:"",
            subscription_plans:"",
            status:0,
            expiration:"NaN",
            progress:"NaN",
            on_wishlist:0
        }
        get_course.forEach(element => {
            var status = 0;
            var expiration ="NaN"
            var progress="NaN";
            var on_wishlist = 0;
            var {_id,course_name, subscription_plans, course_desc, course_image} = element 
            get_user_course.forEach(element2 =>{
                var {session_details} = element2
                session_details.forEach(element3=>{
                    var {course_id, un_answered, no_of_items, completion_c, is_expired, date_expiration} = element3
                    var comp_c =Math.abs(element3.no_of_items - element3.un_answered);
                    var compute_c = Math.round((comp_c/ element3.no_of_items)*100);
                        progress = compute_c

                    if(_id.toString() === course_id.toString()){
                        if(is_expired === true){
                            status = 2
                        }else if(is_expired === false){
                            status = 1
                        }
                        expiration = element3.date_expiration
                    }
                })
            }); 
            if(wish_list){
              wish_list.wish_list.forEach(element4 =>{
                var {course_id } = element4
                if(_id.toString() === element4.course_id.toString()){
                    on_wishlist =1
                }
              });
            }

             set_data ={
                _id:element._id,
                course_name:element.course_name,
                course_desc:element.course_desc,
                course_image:element.course_image,
                subscription_plans:element.subscription_plans,
                status:status,
                progress:progress,
                on_wishlist:on_wishlist,
                expiration:expiration
            }
              courses.push(set_data);
        });
        return courses
    },
    getNumberOfPages = (courses) => {
        return Math.ceil(courses.length / limit);
    },
    getPagedCourses = (courses) => {
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        console.log(drop_course);
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
            var get_course = await getCourse();
            var get_user_course = await getUserCourse();
            var wish_list = await getWishlist();
            var course_list = await ifOwned(get_course, get_user_course,wish_list);
            var number_of_pages = await getNumberOfPages(course_list);
            var paged_courses = await getPagedCourses(course_list);
            
            res.send(200, {code: "Success", msg : "Courses retrieved.", number_of_pages, paged_courses}); 
                
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "An error happened while retrieving exam sessions", e});
        }
    }

    main ();
}