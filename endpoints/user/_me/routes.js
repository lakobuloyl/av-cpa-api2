const api = module.parent.exports.api;
const {validateAppToken  } = require('../../../services/core_services');

const view_profile_v1 = require('./_v/v1/view_user_profile');
const edit_profile_v1 = require('./_v/v1/edit_user_profile');
const change_password_v1 = require('./_v/v1/change_password');
const forgot_password_v1 = require('./_v/v1/forgot_password');

api.get({path:'/user/profile', version: '1.0.0'}, 
validateAppToken,  
view_profile_v1),

api.patch({path:'/user/edit_profile', version: '1.0.0'}, 
validateAppToken,  
edit_profile_v1),

api.patch({path:'/user/change_password', version: '1.0.0'}, 
//validateAppToken,  
change_password_v1);

api.patch({path:'/user/forgot_password', version: '1.0.0'}, 
//validateAppToken,  
forgot_password_v1);

