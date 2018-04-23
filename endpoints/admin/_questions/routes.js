const api = module.parent.exports.api;
const {validateAppToken  } = require('../../../services/core_services');

const questions_create_v1 = require('./_v/v1/questions_create');
const questions_list_v1 = require('./_v/v1/questions_list');
const questions_list_draft_v1 = require('./_v/v1/questions_list_draft');
const questions_accept_draft_v1 = require('./_v/v1/questions_accept_draft');
const questions_search_v1 = require('./_v/v1/questions_search');
const questions_update_v1 = require('./_v/v1/questions_edit');
const questions_remove_v1 = require('./_v/v1/questions_remove');
const questions_to_draft_v1 = require('./_v/v1/questions_to_draft');
const questions_per_lessons_v1 = require('./_v/v1/questions_per_lessons');
const questions_assessment_search_v1 = require('./_v/v1/questions_assessment_search');
const questions_lesson_search_v1 = require('./_v/v1/questions_lessons_search');
const sync_v1 = require('./_v/v1/sync_question');
const questions_list_archived_v1 = require('./_v/v1/questions_list_archived');
const questions_delete_archived_v1 = require('./_v/v1/questions_delete_archived');
const questions_create_bulk_v1 = require('./_v/v1/questions_create_bulk');

    api.post({ path: '/prc_admin/questions_creation' },
    validateAppToken,  
    questions_create_v1);

    api.post({ path: '/prc_admin/questions_create_bulk' },
    validateAppToken,  
    questions_create_bulk_v1);

    api.get({path: '/prc_admin/questions_list_draft'},
    validateAppToken,  
    questions_list_draft_v1);

    api.patch({path: '/prc_admin/questions_accept_draft'},
    validateAppToken,  
    questions_accept_draft_v1);

    api.post({path: '/prc_admin/questions_list'},
    validateAppToken,  
    questions_list_v1);

    api.post({path : '/prc_admin/questions_search/:_id'},
    validateAppToken,  
    questions_search_v1);

    api.patch({path: '/prc_admin/questions_update/:_id'},
    validateAppToken,  
    questions_update_v1);
    
    api.patch({path: '/prc_admin/questions_remove'},
    validateAppToken,  
    questions_remove_v1);

    api.patch({path: '/prc_admin/questions_to_draft/:quest_id'},
    validateAppToken,  
    questions_to_draft_v1);

    api.get({path: '/prc_admin/questions_per_lessons/:lesson_id'},
    validateAppToken,  
    questions_per_lessons_v1);

    api.get({path: '/prc_admin/questions_assessment_search/:course_id'},
    validateAppToken,  
    questions_assessment_search_v1);

    api.get({path: '/prc_admin/questions_lessons_search/:assessment_id'},
    validateAppToken,  
    questions_lesson_search_v1);

    api.post({path: '/prc_admin/sync_question'},
    //validateAppToken,  
    sync_v1);

    api.get({path: '/prc_admin/questions_list_archived'},
    validateAppToken,  
    questions_list_archived_v1);

    api.del({path: '/prc_admin/questions_delete_archived/:_id'},
    validateAppToken,  
    questions_delete_archived_v1);