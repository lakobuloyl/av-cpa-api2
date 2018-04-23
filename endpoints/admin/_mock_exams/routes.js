const api = module.parent.exports.api;
const { validateAppToken } = require('../../../services/core_services');
const mock_exam_create_v1 = require('./_v/v1/mock_exam_create');
const mock_exam_list_questions_v1 = require('./_v/v1/mock_exam_list_questions');
const mock_exam_edit_v1 = require('./_v/v1/mock_exam_edit');
const mock_exam_remove_v1 = require('./_v/v1/mock_exam_remove');
const mock_exam_to_draft_v1 = require('./_v/v1/mock_exam_to_draft');
const mock_accept_draft_v1 = require('./_v/v1/mock_accept_draft');
const mock_exam_list_by_course_v1 = require('./_v/v1/mock_exam_list_by_course');
const mock_exam_search_v1 = require('./_v/v1/mock_exam_search');
const sync_mock_v1 = require('./_v/v1/sync_mock');
const mock_exam_question_search_v1 = require('./_v/v1/mock_exam_question_search');
const mock_exam_filter_question_summary_v1 = require('./_v/v1/mock_exam_filter_question_summary');

    api.post({ path: '/prc_admin/mock_exam_create', version: '1.0.0'}, 
    validateAppToken,  
    mock_exam_create_v1);

    api.post({ path: '/prc_admin/mock_exam_list_questions', version: '1.0.0'},
    mock_exam_list_questions_v1);

    api.patch({ path: '/prc_admin/mock_exam_edit', version: '1.0.0'},
    validateAppToken,
    mock_exam_edit_v1);

    api.patch({ path: '/prc_admin/mock_exam_remove', version: '1.0.0'},
    validateAppToken,
    mock_exam_remove_v1);

    api.patch({ path: '/prc_admin/mock_exam_to_draft/:mock_id', version: '1.0.0'},
    validateAppToken,
    mock_exam_to_draft_v1);

    api.patch({ path: '/prc_admin/mock_accept_draft/:mock_id', version: '1.0.0'},
    validateAppToken,
    mock_accept_draft_v1);

    api.post({ path: '/prc_admin/mock_exam_list_by_course', version: '1.0.0'},
    validateAppToken,
    mock_exam_list_by_course_v1);

    api.post({ path: '/prc_admin/mock_exam_search/:_id', version: '1.0.0'},
    validateAppToken,
    mock_exam_search_v1);

    api.post({ path: '/prc_admin/mock_exam_question_search/:_id', version: '1.0.0'},
    validateAppToken,
    mock_exam_question_search_v1);

    api.patch({ path: '/prc_admin/sync_mock/:course_id', version: '1.0.0'},
    sync_mock_v1);

    api.post({ path: '/prc_admin/mock_exam_filter_question_summary', version: '1.0.0'},
    validateAppToken,
    mock_exam_filter_question_summary_v1);