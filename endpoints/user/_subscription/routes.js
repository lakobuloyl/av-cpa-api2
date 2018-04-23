const api = module.parent.exports.api;
const {validateAppToken,  } = require('../../../services/core_services');

const create_user_v1 = require('./_v/v1/sign_up');
const stripe_v1 = require('./_v/v1/stripe');

api.post({path:'/signup', version: '1.0.0'}, 
//validateAppToken,  
create_user_v1);

api.get({path:'/stripe', version: '1.0.0'}, 
//validateAppToken,  
stripe_v1);