const api = module.parent.exports.api;
const {validateAppToken  } = require('../../../services/core_services');

 const mock_display_v1 = require('./_v/v1/mock_display');
 const mock_specific_v1 = require('./_v/v1/mock_specific');
 const mock_record_v1 = require('./_v/v1/mock_record');
 const mock_graph_v1 = require('./_v/v1/mock_graph');
 const mock_flag_question_v1 = require('./_v/v1/mock_flag_question');
 const mock_logs_summary_v1 = require('./_v/v1/mock_logs_summary');
 const mock_display_attempts_v1 = require('./_v/v1/mock_display_attempts');


    api.get({path:'/user/v1/mock_display/:course_id', version: '1.0.0'}, 
    validateAppToken,  
    mock_display_v1);

    api.get({path:'/user/v1/mock_specific/:m_id', version: '1.0.0'}, 
    //validateAppToken,  
    mock_specific_v1);

    api.post({path:'/user/v1/mock_record', version: '1.0.0'}, 
    validateAppToken,  
    mock_record_v1);

    api.get({path:'/user/v1/mock_graph/:course_id', version: '1.0.0'}, 
    validateAppToken,  
    mock_graph_v1);

    api.post({path:'/user/v1/mock_logs_summary', version: '1.0.0'}, 
    validateAppToken,  
    mock_logs_summary_v1);

    api.post({path:'/user/v1/mock_flag_question', version: '1.0.0'}, 
    validateAppToken,  
    mock_flag_question_v1);

    api.get({path:'/user/v1/mock_display_attempts/:mock_exam_id', version: '1.0.0'}, 
    validateAppToken,  
    mock_display_attempts_v1);