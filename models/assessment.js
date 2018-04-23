const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const assessment = new Schema({
    course_id: {type: Schema.ObjectId, ref: 'course', required: true},
    created_by: {type: Schema.ObjectId, ref: 'user_accounts'},
    assessment_name: {type: String, required: true},
    assessment_desc: {type: String, required: true},
    
    is_draft: {type: Boolean, default:0},
    assessment_on_archive:{type: Boolean, default:0 }
});
module.exports = mongoose.model('assessment', assessment);
