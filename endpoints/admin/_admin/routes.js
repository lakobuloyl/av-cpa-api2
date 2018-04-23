const api = module.parent.exports.api;
const {validateAppToken} = require('../../../services/core_services');

const admin_create_v1 = require('./_v/v1/create_admin');
const admin_list_v1 = require('./_v/v1/list_admins');
const admin_search_v1 = require('./_v/v1/search_admin');
const admin_update_v1 = require('./_v/v1/edit_admin');
const admin_remove_v1 = require('./_v/v1/remove_admin');
const admin_display_archived_v1 = require('./_v/v1/display_archived_users');
const admin_delete_archived_v1 = require('./_v/v1/delete_archived_user');
const admin_check_exist_v1 = require('./_v/v1/check_exist_admin');


    api.post({path:'/prc_admin/create_admin', version: '1.0.0'},
    validateAppToken,  
    admin_create_v1);

    api.post({path:'/prc_admin/list_admins', version: '1.0.0'}, 
    validateAppToken, 
    admin_list_v1);

    api.post({path:'/prc_admin/search_admin/:_id', version: '1.0.0'}, 
    validateAppToken, 
    admin_search_v1);

    api.patch({path: '/prc_admin/admin_update/:_id', version: '1.0.0'},
    validateAppToken, 
    admin_update_v1);

    api.patch({path: '/prc_admin/remove_admin/:_id', version: '1.0.0'},
    validateAppToken, 
    admin_remove_v1);

    api.get({path:'/prc_admin/display_archived_users', version: '1.0.0'}, 
    validateAppToken, 
    admin_display_archived_v1);

    api.del({path:'/prc_admin/delete_archived_user/:_id', version: '1.0.0'},
    validateAppToken, 
    admin_delete_archived_v1);

    api.post({path:'/prc_admin/check_exist_admin', version: '1.0.0'}, 
    //validateAppToken, 
    admin_check_exist_v1);