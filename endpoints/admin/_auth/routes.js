const api = module.parent.exports.api;
const {validateAppToken} = require('../../../services/core_services');
const coreService = require('../../../services/core_services');

const login_admin_v1 = require('./_v/v1/login');
const change_password_v1 = require('./_v/v1/change_password');
const forget_password_v1 = require('./_v/v1/forgot_password');
const valid_email_v1 = require('./_v/v1/valid_email');


    api.post({path:'/prc_admin/login', version: '1.0.0'},
    login_admin_v1);

    api.post({path:'/prc_admin/valid_email', version: '1.0.0'},
    valid_email_v1);

    api.patch({path:'/prc_admin/change_password/:_id', version: '1.0.0'},
    validateAppToken,
    change_password_v1);

    api.patch({path:'/prc_admin/forgot_password', version: '1.0.0'}, 
    forget_password_v1);