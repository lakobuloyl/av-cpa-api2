//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');
const course = require('../../../../../models/course.js');
const mock_exam = require('../../../../../models/mock_exam.js'),
{
    decodeToken
}
 = require('../../../../../services/core_services');
const _ = require('lodash');

module.exports = function(req,res,next){
    const { membership_type, _id } = decodeToken(req.headers['x-access-token']);
    const is_draft = req.body.is_draft || 0;
    const course_on_archive = req.body.course_on_archive || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getCourses = () => {
        //console.log("type: "+membership_type, _id);
        if(membership_type === 0) {
            if(is_draft === 2) {
                return course.find({
                    course_on_archive: course_on_archive
                }).sort({ is_draft: -1 }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return course.find({
                    is_draft: is_draft,
                    course_on_archive: course_on_archive
                }).sort({ is_draft: -1 }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
        else {
            if(is_draft === 2) {
                return course.find({
                    course_on_archive: course_on_archive,
                    created_by: _id
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return course.find({
                    is_draft: is_draft,
                    course_on_archive: course_on_archive,
                    created_by: _id
                }).then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
    },
    getMockExams = () => {
        return mock_exam.find({
            is_archived: false
        }).then(data => {
           return data;
        }).catch(err => {
            throw err;
        });
    },
    getMockExamsPerCourse = (courses, mock_exams) => {
        return courses.map(courses_display => {
            const {
                _id, course_name, course_desc, subscription_plans, course_image, is_draft
                //_id, course_name, course_desc, course_pricing, course_image, is_draft
            } = courses_display;
            var count = 0, no_of_drafts = 0, status;

            _.forEach(mock_exams, (element) => {
                if(element.course_id.toString() === _id.toString()) {
                    count++;

                    if(element.is_draft == 1) {
                        no_of_drafts++;
                    }
                }
            });

            if(is_draft) {
                status = "Draft";
            }
            else {
                status = "Published";
            }
            
            return {
                _id, course_name, course_desc, subscription_plans, course_image, count, status, no_of_drafts
                // _id, course_name, course_desc, course_pricing, course_image, count, status, no_of_drafts
            };
        });
    },
    getNumberOfPages = (courses) => {
        return Math.ceil(courses.length / limit);
    },
    getPagedCourses = (courses) => {
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        
        return take_course;
    };
    
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                //IBANG YUNG APPROACH DITO KASI BY DRAFT LANG SIYA FINI-FILTER AT DIRETSO NA SA COLLECTION YUNG IP-PAGE
                var courses = await getCourses();
                var mock_exams = await getMockExams();

                if(courses.length > 0) {
                    var number_of_pages = await getNumberOfPages(courses);
                    //console.log(number_of_pages);
                    var paged_courses = await getPagedCourses(courses);
                    var mock_exams_per_course = await getMockExamsPerCourse(paged_courses, mock_exams);
                    
                    //var display_course = await mapCourse(paged_courses);
                    res.send(200, {code: "Success", msg : "Courses retrieved", number_of_pages, mock_exams_per_course});
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "no Courses to display", courses});
                }
            // }
            // else{
            //     res.send(403,{code:"FORBIDDEN", message:"Invalid Account Access"});
            // } 
        } catch (e) {
            //console.log("Error2: " + e);
            res.send(500, {code: "Failed", msg : "no Courses to display", e});
        }
    }

    main ();
}