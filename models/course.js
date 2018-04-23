const mongoose = require('mongoose'),
Schema = mongoose.Schema;

//USER MEMBER SCHEMA
const course = new Schema({
    course_name: {type: String, required: true},
    course_desc: {type: String, required: true},
    //course_price:{type: String, required: true},
    course_image:{type: String, required: true},

    is_draft: {type: Boolean, default:0},
    subscription_plans:[{}],
    course_on_archive: {type: Boolean, default:0}, // 0 = active 1 = on archive 
    created_by: {type: Schema.ObjectId, ref: 'user_accounts'},
});
module.exports = mongoose.model('course', course);
