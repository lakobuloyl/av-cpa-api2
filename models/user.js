const mongoose = require('mongoose'),
Schema = mongoose.Schema;


//USER MEMBER SCHEMA
const user_accounts = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    birthdate:{type: String},
    address:{type: String},
    contact_no: {type: String},
    gender:{type: String},

    username: {type: String},
    password: {type: String},
    email: {type: String}, 
    user_img_url:{type: String},
    membership_reg_date:{type:Date,default:new Date(Date.now())},
    membership_type:{type: Number}, // 0 - admin 1 - encoder  2 - regular user 

    // user_settings:
    //     {
    //         push_notification: {type: Number, default:0},
    //         isActive: {type: Number, default:1},
    //         isPrivate: {type: Number, default:0}
    //     },
    user_on_archive: {type: Boolean, default:0}, // 0 = active 1 = on archive 
});
module.exports = mongoose.model('user_accounts', user_accounts);
