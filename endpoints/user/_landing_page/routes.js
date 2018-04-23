const api = module.parent.exports.api;
const {validateAppToken  } = require('../../../services/core_services');

 const landing_page_v1 = require('./_v/v1/landing_page');
 const course_details_v1 = require('./_v/v1/course_details');
 const course_search_v1 = require('./_v/v1/course_search');
 const course_list_v1 = require('./_v/v1/course_list');



    api.post({path:'/user/landing_page', version: '1.0.0'}, 
    //validateAppToken,  
    landing_page_v1);

    api.get({path:'/user/course_details/:c_id', version: '1.0.0'}, 
    //validateAppToken,  
    course_details_v1);

    api.post({path:'/user/course_search', version: '1.0.0'}, 
    //validateAppToken,  
    course_search_v1);

    api.post({path:'/user/course_list', version: '1.0.0'}, 
    validateAppToken,  
    course_list_v1);

