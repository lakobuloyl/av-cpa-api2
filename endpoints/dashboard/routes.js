const api = module.parent.exports.api;
const {validateAppToken } = require('../../services/core_services');

const dashboard_v1 = require('./_v/v1/dashboard');
const dashboard_user_v1 = require('./_v/v1/dashboard_user');

    api.get({path:'/prc_admin/dashboard', version: '1.0.0'},
    dashboard_v1);

    api.get({path:'/prc_admin/dashboard_user', version: '1.0.0'},
    validateAppToken,
    dashboard_user_v1);
