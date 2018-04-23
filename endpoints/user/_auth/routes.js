const api = module.parent.exports.api;
const coreService = require('../../../services/core_services');

const login_admin_v1 = require('./_v/v1/login');

    api.post({path:'/user/login', version: '1.0.0'}, 
    login_admin_v1);

