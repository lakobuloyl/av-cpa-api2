const mongoose = require('mongoose'),
Schema = mongoose.Schema;



const questions = new Schema({
    
        lesson_id: {type: Schema.ObjectId, ref: 'lessons'},
        assessment_id:{type: Schema.ObjectId, ref: 'assessment'},
        course_id:{type: Schema.ObjectId, ref: 'course'},
        question: {type: String},
        choices: {type: Array},
        explaination: {type: Array},
        answer_key: {type: String},
        is_draft:{type: Boolean, default:0},
        is_answered:{type: Boolean, default:0},
        time_limit:{type:Number, default:0},
        questions_on_archive: {type: Boolean, default:0},
        created_by: {type: Schema.ObjectId, ref: 'user_accounts'}
});
module.exports = mongoose.model('questions', questions);

