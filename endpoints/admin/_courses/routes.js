const api = module.parent.exports.api;

const {validateAppToken} = require('../../../services/core_services');

const course_create_v1 = require('./_v/v1/courses_create');
const course_get_v1 = require('./_v/v1/courses_lists');
const courses_accept_draft_v1 = require('./_v/v1/courses_accept_draft');
const course_search_v1 = require('./_v/v1/courses_search');
const course_update_v1 = require('./_v/v1/courses_edit');
const course_remove_v1 = require('./_v/v1/courses_remove');
const courses_to_draft_v1 = require('./_v/v1/courses_to_draft');
const course_display_archived_v1 = require('./_v/v1/courses_display_archived');
const course_delete_archived_v1 = require('./_v/v1/courses_delete_archived');
const course_list_for_mock_v1 = require('./_v/v1/course_list_for_mock');
const course_bulk_publish_v1 = require('./_v/v1/course_bulk_publish');
const course_search_for_mock_v1 = require('./_v/v1/course_search_for_mock');

    api.post({ path: '/prc_admin/courses_create' },
    validateAppToken,  
    course_create_v1);

    api.post({ path: '/prc_admin/course_bulk_publish' },
    validateAppToken,  
    course_bulk_publish_v1);

    api.patch({path: '/prc_admin/courses_accept_draft', version: '1.0.0'},
    validateAppToken,  
    courses_accept_draft_v1);

    api.post({path: '/prc_admin/course_list_for_mock', version: '1.0.0'},
    validateAppToken,  
    course_list_for_mock_v1);

    api.post({path: '/prc_admin/course_lists', version: '1.0.0'},
    validateAppToken,  
    course_get_v1);

    api.post({path : '/prc_admin/course_search/:_id', version: '1.0.0'},
    validateAppToken,  
    course_search_v1);

    api.patch({path: '/prc_admin/course_update/:_id', version: '1.0.0'},
    validateAppToken,  
    course_update_v1);

    api.patch({path: '/prc_admin/courses_remove', version: '1.0.0'},
    validateAppToken,  
    course_remove_v1);

    api.get({path: '/prc_admin/course_display_archived', version: '1.0.0'},
    validateAppToken,  
    course_display_archived_v1);

    api.del({path: '/prc_admin/courses_delete_archived/:_id', version: '1.0.0'},
    validateAppToken,  
    course_delete_archived_v1);

    api.patch({path: '/prc_admin/courses_to_draft/:course_id', version: '1.0.0'},
    validateAppToken,  
    courses_to_draft_v1);

    api.post({path : '/prc_admin/course_search_for_mock', version: '1.0.0'},
    validateAppToken,  
    course_search_for_mock_v1);