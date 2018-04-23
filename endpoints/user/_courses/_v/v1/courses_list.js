//this api is for ``
// API version 2 
// junryl

const mongoose = require('mongoose');
const _ = require('lodash');
const exam_session = require('../../../../../models/exam_sessions'),
 exam_mock_session = require('../../../../../models/exam_mock_session'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { _id } = decodeToken(req.headers['x-access-token']);

    const is_expired = req.body.is_expired ;
    const limit = req.body.limit || 6;
    const page = req.body.page || 1;

    const
    getCourses = () => {
        return exam_session.findOne({
            user_id:_id
        })
        .populate({
            path:"session_details.course_id",
            select:"course_name course_image course_desc is_expired"
            })
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

    },
    getMock = () => {
       return exam_mock_session.findOne({
            user_id:_id
        })
        .then(data => {
            return data;
        }).catch(err => {
            throw err;
        });

    },
    getNumberOfCourses = (courses) => {
        return Math.ceil(courses.length / limit);
    },
    mapSession = (get_mock) =>{
        var mock_array = []
        get_mock.users_mock.map(exam=>{
            var unanswered = incorrect = correct = 0
            exam.mock_details.map(m_d=>{
                const {mock_questions} = m_d
                    mock_questions.map(m_q =>{
                        var {status} = m_q
                        if(m_q.status === 0){
                            ++unanswered;
                        }else if(m_q.status ===1 ){
                            ++correct;
                        }else if(m_q.status === 2){
                            ++incorrect;
                        }
                    })  
            })
           
            var total  = unanswered + incorrect + correct;
            
            var progress =((incorrect+correct)/total)*100
            var set_data =  {  
                        course_id:exam.course_id,
                        progress:progress}
            mock_array.push(set_data);
        })
       return mock_array
    };
    mapCourse=(map_course,map_session) =>{
        var course_array = []
         var set_data = {
                _id:_id,
                course_name:"", 
                course_image:"",
                completion_c:0 , 
                course_desc:"", 
                is_expired:"", 
                date_expiration:""}
         map_course.forEach(sd =>{
            var {course_id, un_answered, no_of_items, completion_c, is_expired, date_expiration} = sd
            var prog = 0;
            var _id = ""
             map_session.forEach(g_m =>{
               var { course_id ,progress} =g_m
                    if(sd.course_id._id.toString() === g_m.course_id.toString()){
                        prog =g_m.progress
                        _id : g_m.course_id;
                    }
                    
                    sd.completion_c = compute_c 
                });
                if(sd.is_expired == req.body.is_expired  ){
                    var comp_c =Math.abs(sd.no_of_items - sd.un_answered);
                    var compute_c = Math.round((comp_c/ sd.no_of_items)*100);
                     var set_data = {
                        _id:sd.course_id._id,
                        course_name:sd.course_id.course_name, 
                        course_image:sd.course_id.course_image,
                        completion_c:(compute_c+prog)/2 , 
                        course_desc:sd.course_id.course_desc, 
                        is_expired:sd.is_expired, 
                        date_expiration:sd.date_expiration}
                } 
             course_array.push(set_data)
        });
       _.pull(course_array, undefined);
        return course_array
    },
    getPagedCourses = (courses) => {
        // var unique_course = [];
        // for(i = 0; i< courses.length; i++){    
        //     if(unique_course.indexOf(courses[i]._id) === -1){
            
        //         unique_course.push(courses[i]._id);        
        //     }        
        // }

       // console.log(set.length);
        var drop_course = _.drop(courses, (limit * page) - limit);
        var take_course = _.take(drop_course, limit);
        //console.log(drop_course);
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
                var courses = await getCourses();
                if(courses !== null)
                {   var get_mock = await getMock()
                    var map_session = await mapSession (get_mock)
                    var map_course = courses.session_details;
                    
                    var set_data = await mapCourse(map_course,map_session);
                    var number_of_pages = await getNumberOfCourses(set_data);
                    var paged_courses = await getPagedCourses(set_data);
                    //console.log(paged_courses.length + " " + paged_courses);
                    if(paged_courses) {
                        res.send(200, {code: "Success", msg : "Courses retrieved", number_of_pages, paged_courses});
                    }
                    else {
                        res.send(404, {code: "NOT FOUND", msg : "No Courses to Display"});
                    }
                }
                else{
                    res.send(404, {code: "NOT FOUND", msg : "No Courses to Display"});
                }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving courses", e});
        }
    }

    main ();
}