const api = module.parent.exports.api;
const {validateAppToken,  } = require('../../../services/core_services');

const courses_list_v1 = require('./_v/v1/courses_list');
const courses_archive_v1 = require('./_v/v1/courses_archive');
const courses_search_v1 = require('./_v/v1/courses_search');
const courses_assessments_v1 = require('./_v/v1/courses_assessments');
const courses_lessons_v1 = require('./_v/v1/courses_lessons');
const courses_wishlist_v1 = require('./_v/v1/courses_wishlist');
const courses_wishlist_display_v1 = require('./_v/v1/courses_wishlist_display');
const course_exam_graph_v1 = require('./_v/v1/course_exam_graph');

const course_display_metrics_v1 = require('./_v/v1/course_display_metrics');
const course_display_v1 = require('./_v/v1/course_display');

api.post({path:'/user/courses/list', version: '1.0.0'}, 
validateAppToken,  
courses_list_v1);

api.get({path:'/user/courses/graph/:course_id', version: '1.0.0'}, 
validateAppToken,  
course_exam_graph_v1);

api.post({path:'/user/courses/archive', version: '1.0.0'}, 
validateAppToken,  
courses_archive_v1);

api.post({path:'/user/courses/wishlist/:course_id', version: '1.0.0'}, 
validateAppToken,  
courses_wishlist_v1);

api.
post({path:'/user/courses/wishlist_display', version: '1.0.0'}, 
validateAppToken,  
courses_wishlist_display_v1);

api.post({path : '/user/courses/search', version: '1.0.0'},
//validateAppToken,  
courses_search_v1);

api.get({path : '/user/courses/assessments/:course_id', version: '1.0.0'},
validateAppToken,  
courses_assessments_v1);

api.get({path : '/user/courses/lessons/:course_id', version: '1.0.0'},
//validateAppToken,  
courses_lessons_v1);

api.post({path : '/user/courses/course_display_metrics', version: '1.0.0'},
//validateAppToken,  
course_display_metrics_v1);

api.get({path : '/user/courses/course_display/:_id', version: '1.0.0'},
validateAppToken,  
course_display_v1);
