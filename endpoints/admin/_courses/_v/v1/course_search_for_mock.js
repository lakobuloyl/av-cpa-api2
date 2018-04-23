//this api is for displaying of courses   list
// API version 2 
// junryl

const mongoose = require('mongoose');
const course = require('../../../../../models/course.js');
const mock_exam = require('../../../../../models/mock_exam.js');
const _ = require('lodash'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);
    const is_draft = req.body.is_draft || 2;
    const course_on_archive = req.body.course_on_archive || 0;
    const limit = req.body.limit || 100;
    const page = req.body.page || 1;
    var search = req.body.search || "";

    //IS_DRAFT VALUES:
    //0 = RETURN NON-DRAFTS
    //1 = RETURN DRAFTS
    //2 = RETURN BOTH DRAFTS AND NON-DRAFTS

    const
    getCourses = () => {
        if(membership_type === 0) {
            if(is_draft === 2) {
                return course.find({
                    course_on_archive: course_on_archive
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return course.find({
                    is_draft: is_draft,
                    course_on_archive: course_on_archive
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
        }
        else {
            var user_id = decodeToken(req.headers['x-access-token'])._id;

            if(is_draft === 2) {
                return course.find({
                    course_on_archive: course_on_archive, 
                    created_by: user_id
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
                    return data;
                }).catch(err => {
                    throw err;
                });
            }
            else {
                return course.find({
                    is_draft: is_draft,
                    course_on_archive: course_on_archive, 
                    created_by: user_id
                }).
                //skip((limit * page) - limit).
                //limit(limit)
                then(data => {
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
    getNumberOfPages = (courses) => {
        //var new_array = _.chunk(courses, limit);
        //return new_array.length;
        return Math.ceil(courses.length / limit);
    },
    getPagedCourses = (courses) => {
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        
        return take_course;
    },
    searchCourses = (courses) => {
        return _.filter(courses, (element) => {
            var x = new RegExp(_.escapeRegExp(search), "i");
            //console.log("x: " + element.course_id.course_name + " - " + element.assessment_name.match(/search/g));
            return x.test(element.course_name);
        });
    },
    getMockExamsPerCourse = (courses, mock_exams) => {
        return courses.map(courses_display => {
            const {
                _id, course_name, course_desc
            } = courses_display;
            var count = 0;
            
            //console.log("user_id: " + user_id);

            _.forEach(mock_exams, (element) => {
            if(element.course_id.toString() === _id.toString()) {
                    count++;
                }
            });

            return {
                _id, course_name, course_desc, count
            };
        });
    };
    
    async function main() {
        try {
            // if(membership_type === 1)
            // {
                var courses = await getCourses();
                var mock_exams = await getMockExams();
                console.log(courses);
                var search_courses = await searchCourses(courses);
                courses = search_courses;
                //console.log(courses, membership_type);

                if(courses.length > 0){
                    var number_of_pages = await getNumberOfPages(courses);
                    var paged_courses = await getPagedCourses(courses);
                    var mock_exams_per_course = await getMockExamsPerCourse(paged_courses, mock_exams);

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