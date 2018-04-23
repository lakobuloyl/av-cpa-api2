const mongoose = require('mongoose'),
Schema = mongoose.Schema;


//USER MEMBER SCHEMA
const lessons = new Schema({
    lesson_name: {type: String, required: true},
    lesson_desc: {type: String},

    assessment_id:{type: Schema.ObjectId, ref: 'assessment', required: true},
    course_id:{type: Schema.ObjectId, ref: 'course', required: true},
    
    is_draft: {type: Boolean, default:0},
    lesson_on_archive:{type: Boolean, default:0}, /// enum 0 active, 1 on archive
    created_by: {type: Schema.ObjectId, ref: 'user_accounts'},
});
module.exports = mongoose.model('lessons', lessons);
