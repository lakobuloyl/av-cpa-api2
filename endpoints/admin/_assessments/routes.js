const api = module.parent.exports.api;
const {validateAppToken} = require('../../../services/core_services');
const assessment_create_v1 = require('./_v/v1/assessment_create');
const assessment_accept_draft_v1 = require('./_v/v1/assessment_accept_draft');
const assessment_get_v1 = require('./_v/v1/assessment_lists');
const assessment_search_v1 = require('./_v/v1/assessment_search');
const assessment_update_v1 = require('./_v/v1/assessment_edit');
const assessment_remove_v1 = require('./_v/v1/assessment_remove');
const assessment_to_draft_v1 = require('./_v/v1/assessment_to_draft');
const assessment_list_archived_v1 = require('./_v/v1/assessment_list_archived');
const assessment_delete_archived_v1 = require('./_v/v1/assessment_delete_archived');
const dropdown_v1 = require('./_v/v1/drop_down');

    api.post({ path: '/prc_admin/assessment_creation', version: '1.0.0'}, 
    validateAppToken,  
    assessment_create_v1);

    api.post({path: '/prc_admin/assessment_lists', version: '1.0.0'}, 
    validateAppToken,  
    assessment_get_v1);


    api.patch({path: '/prc_admin/assessment_accept_draft', version: '1.0.0'}, 
    validateAppToken,  
    assessment_accept_draft_v1);

    api.post({path : '/prc_admin/assessment_search/:_id', version: '1.0.0'}, 
    validateAppToken,  
    assessment_search_v1);

    api.patch({path: '/prc_admin/assessment_update/:_id', version: '1.0.0'}, 
    validateAppToken,  
    assessment_update_v1);

    api.patch({path: '/prc_admin/assessment_remove', version: '1.0.0'}, 
    validateAppToken,  
    assessment_remove_v1);

    api.patch({path: '/prc_admin/assessment_to_draft/:assess_id', version: '1.0.0'}, 
    validateAppToken,  
    assessment_to_draft_v1);

    api.get({path: '/prc_admin/drop_down', version: '1.0.0'}, 
    //validateAppToken,  
    dropdown_v1);

    api.get({path: '/prc_admin/assessment_list_archived', version: '1.0.0'},
    validateAppToken,  
    assessment_list_archived_v1);

    api.del({path: '/prc_admin/assessment_delete_archived/:_id', version: '1.0.0'},
    validateAppToken,  
    assessment_delete_archived_v1);