//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');
const course = require('../../../../../models/course.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    var { _id } = req.params || 0;
    var search = req.body.search || "";

    const is_draft = req.body.is_draft || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getCourses = () => {
        if(membership_type === 0) {
            if(is_draft === 2) {
                if(_id != 0) {
                    return course.find({ 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        course_on_archive: 0
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
                else {
                    return course.find({ 
                        $or:[
                            {course_name:{$regex: _.escapeRegExp(search), $options: 'i'}  }
                        ], 
                        course_on_archive:0
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
            }
            else {
                if(_id != 0) {
                    return course.find({ 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        course_on_archive: 0,
                        is_draft: is_draft
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
                else {
                    return course.find({ 
                        $or:[
                            {course_name:{$regex: _.escapeRegExp(search), $options: 'i'}  }
                        ], 
                        course_on_archive: 0,
                        is_draft: is_draft
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
            }
        }
        else {
            const user_id = decodeToken(req.headers['x-access-token'])._id;
            
            if(is_draft === 2) {
                if(_id != 0) {
                    return course.find({ 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        course_on_archive: 0,
                        created_by: user_id
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
                else {
                    return course.find({ 
                        $or:[
                            {course_name:{$regex: _.escapeRegExp(search), $options: 'i'}  }
                        ], 
                        course_on_archive: 0,
                        created_by: user_id
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
            }
            else {
                if(_id != 0) {
                    return course.find({ 
                        $or:[
                            { _id: mongoose.Types.ObjectId(_id)}  
                        ], 
                        course_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
                else {
                    return course.find({ 
                        $or:[
                            {course_name:{$regex: _.escapeRegExp(search), $options: 'i'}  }
                        ], 
                        course_on_archive: 0,
                        is_draft: is_draft,
                        created_by: user_id
                    }).sort({ is_draft: -1 }).
                    then(data => {
                        return data;
                    }).catch(err => {
                        throw err;
                    });
                }
            }
        }
    },
    getCoursesByUser = (courses) => {
        const user_id = decodeToken(req.headers['x-access-token'])._id;
        if(membership_type === 1) {
            return _.filter(courses, (element) => {
                return element.created_by.toString() === user_id.toString();
            });
        }
        else {
            return courses;
        }
    },
    getNumberOfPages = (courses) => {
        return Math.ceil(courses.length / limit);
    },
    getPagedCourses = (courses) => {
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        
        return take_course;
    },
    mapCourse = (courses) =>
    {
        return courses.map(courses_display => {
            const { _id, course_name, course_desc, subscription_plans, course_image, is_draft } = courses_display;
            //const { _id, course_name, course_desc, course_pricing, course_image, is_draft } = courses_display;
            var status;
            if(is_draft) {
                status = "Draft";
            }
            else {
                status = "Published";
            }

            return { _id, course_name, course_desc, subscription_plans, course_image, status };
            //return { _id, course_name, course_desc, course_pricing, course_image, status };
        });
    };
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var courses = await getCourses();
                var courses_by_user = await getCoursesByUser(courses);

                if(courses_by_user.length > 0) {
                    var number_of_pages = await getNumberOfPages(courses_by_user);
                    var paged_courses = await getPagedCourses(courses_by_user);
                    var display_course = await mapCourse(paged_courses)
                    res.send(200, {code: "Success", msg : "Courses retrieved", number_of_pages, display_course});
                }
                else {
                    res.send(404, {code: "NOT FOUND", msg : "no Courses to display"});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            console.log(e)
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}