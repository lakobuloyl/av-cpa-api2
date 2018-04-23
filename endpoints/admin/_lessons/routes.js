const api = module.parent.exports.api;

const {validateAppToken} = require('../../../services/core_services');

const lessons_create_v1 = require('./_v/v1/lessons_create');
const lessons_accept_draft_v1 = require('./_v/v1/lessons_accept_draft');
const lessons_get_v1 = require('./_v/v1/lessons_lists');
const lessons_search_v1 = require('./_v/v1/lessons_search');
const lessons_search_by_id_v1 = require('./_v/v1/lessons_search_by_id');
const lessons_update_v1 = require('./_v/v1/lessons_edit');
const lessons_remove_v1 = require('./_v/v1/lessons_remove');
const lessons_to_draft_v1 = require('./_v/v1/lessons_to_draft');
const dropdown_v1 = require('./_v/v1/drop_down');
const lessons_list_archived_v1 = require('./_v/v1/lessons_list_archived');
const lessons_delete_archived_v1 = require('./_v/v1/lessons_delete_archived');

    api.post({ path: '/prc_admin/lessons_creation', version: '1.0.0'}, 
    validateAppToken,  
    lessons_create_v1);

    api.patch({path: '/prc_admin/lessons_accept_draft', version: '1.0.0'}, 
    validateAppToken,  
    lessons_accept_draft_v1);

    api.post({path: '/prc_admin/lessons_lists', version: '1.0.0'}, 
    validateAppToken,  
    lessons_get_v1);

    api.post({path : '/prc_admin/lessons_search/:_id', version: '1.0.0'}, 
    validateAppToken,  
    lessons_search_v1);

    api.get({path : '/prc_admin/lessons_search_by_id/:lesson_id', version: '1.0.0'}, 
    validateAppToken,  
    lessons_search_by_id_v1);

    api.patch({path: '/prc_admin/lessons_update/:_id', version: '1.0.0'}, 
    validateAppToken,  
    lessons_update_v1);

    api.patch({path: '/prc_admin/lessons_remove', version: '1.0.0'}, 
    validateAppToken,  
    lessons_remove_v1);

    api.patch({path: '/prc_admin/lessons_to_draft/:lesson_id', version: '1.0.0'}, 
    validateAppToken,  
    lessons_to_draft_v1);

    api.get({path: '/prc_admin/drop_down_ass', version: '1.0.0'}, 
    validateAppToken,  
    dropdown_v1);

    api.get({path: '/prc_admin/lessons_list_archived', version: '1.0.0'},
    validateAppToken,  
    lessons_list_archived_v1);

    api.del({path: '/prc_admin/lessons_delete_archived/:_id', version: '1.0.0'},
    validateAppToken,  
    lessons_delete_archived_v1);