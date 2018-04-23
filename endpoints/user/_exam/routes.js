const api = module.parent.exports.api;
const {validateAppToken  } = require('../../../services/core_services');

// exam
const create_session_v1 = require('./_v/v1/create_session');
const exam_actual_v1 = require('./_v/v1/exam_actual');
const exam_view_summary_v1 = require('./_v/v1/exam_view_summary');
const list_exam_questions_v1 = require('./_v/v1/exam_questions');
const exam_flagged_v1 = require('./_v/v1/exam_flagged');

//logs
const exam_logs_v1 = require('./_v/v1/exam_logs');
const exam_edit_logs_v1 = require('./_v/v1/exam_edit_logs');
const exam_resume_v1 = require('./_v/v1/exam_resume');
const exam_resume_record_v1 = require('./_v/v1/exam_resume_record');
const exam_show_last_10_v1 = require('./_v/v1/exam_show_last_10');
const exam_log_edit_name_v1 = require('./_v/v1/exam_log_edit_name');
const exam_get_logs_v1 = require('./_v/v1/exam_get_logs');

const renew_session_v1 = require('./_v/v1/renew_session');

//exam
    api.post({path:'/user/exam/create_session', version: '1.0.0'}, 
    //validateAppToken,  
    create_session_v1);

    api.post({path:'/user/exam/exam_actual', version: '1.0.0'}, 
    //validateAppToken,  
    exam_actual_v1);

    api.post({path:'/user/exam/exam_questions', version: '1.0.0'}, 
    validateAppToken,  
    list_exam_questions_v1);

    api.get({path:'/user/exam/exam_view_summary/:log_id', version: '1.0.0'},
    validateAppToken,   
    exam_view_summary_v1);

    api.post({path:'/user/exam/exam_flagged', version: '1.0.0'},
    validateAppToken,   
    exam_flagged_v1);


    //logs 
    api.post({path:'/user/exam/exam_edit_logs', version: '1.0.0'},
    validateAppToken,   
    exam_edit_logs_v1);

    api.post({path:'/user/exam/exam_resume_record/:log_id', version: '1.0.0'},
    validateAppToken,   
    exam_resume_record_v1);

    api.post({path:'/user/exam/exam_logs', version: '1.0.0'},
    validateAppToken,   
    exam_logs_v1);

    api.get({path:'/user/exam/exam_resume/:log_id', version: '1.0.0'},
    validateAppToken,   
    exam_resume_v1);

    api.post({path:'/user/exam/exam_show_last_10', version: '1.0.0'},
    validateAppToken,   
    exam_show_last_10_v1);


    api.patch({path:'/user/exam/renew_session', version: '1.0.0'},
    validateAppToken,   
    renew_session_v1);
 
 
// dummy
const apply_course_v1 = require('./_v/v1/apply_course');

api.post({path:'/user/exam/apply_course', version: '1.0.0'}, 
validateAppToken,  
apply_course_v1);

api.patch({path:'/user/exam/exam_log_edit_name', version: '1.0.0'},
    validateAppToken,   
    exam_log_edit_name_v1);

    api.post({path:'/user/exam/exam_get_logs/:log_id', version: '1.0.0'},
    validateAppToken,   
    exam_get_logs_v1);