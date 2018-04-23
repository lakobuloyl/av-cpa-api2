const api = module.parent.exports.api;
const {validateAppToken} = require('../../../services/core_services');

const view_profile_v1 = require('./_v/v1/view_profile');
const edit_profile_v1 = require('./_v/v1/edit_profile');

    api.get({ path: '/prc_admin/profile', version: '1.0.0'}, 
    validateAppToken,  
    view_profile_v1);

    api.patch({path: '/prc_admin/edit_profile', version: '1.0.0'}, 
    validateAppToken,  
    edit_profile_v1);