const api = module.parent.exports.api;
const {validateAppToken} = require('../../../services/core_services');

const user_list_v1 = require('./_v/v1/users_list');
const user_update_v1 = require('./_v/v1/users_edit');
const user_search_v1 = require('./_v/v1/users_search');
const user_remove_v1 = require('./_v/v1/users_remove');

    api.post({path:'/prc_admin/users_list', version: '1.0.0'},
    //validateAppToken,  
    user_list_v1);

    api.get({path : '/prc_admin/user_search/:_id', version: '1.0.0'},
    //validateAppToken,  
    user_search_v1);

    api.patch({path: '/prc_admin/user_update/:_id', version: '1.0.0'},
    validateAppToken,  
    user_update_v1);

    api.patch({path: '/prc_admin/users_remove/:_id', version: '1.0.0'},
    validateAppToken,  
    user_remove_v1);
