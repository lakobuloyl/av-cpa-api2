const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const mock_exam = new Schema({
    mock_exam_name: { type: String, required: true },
    mock_exam_description: { type: String },
    course_id: { type: Schema.ObjectId, ref: 'course', required: true },
    //attempts: { type: Number, default: 0 },
    is_archived: {type: Boolean, default: 0 }, 
    total_time: { type: Number },
    no_of_questions: { type: Number },
    is_draft:{type: Number, default: 0 }, 
    created_by: {type: Schema.ObjectId, ref: 'user_accounts'},
    question_list: [
        {
            lesson_id: { type: Schema.ObjectId, ref: 'lessons', required: true },
            assessment_id: { type: Schema.ObjectId, ref: 'assessment', required: true },
            course_id: { type: Schema.ObjectId, ref: 'course', required: true },
            question: { type: String, required: true },
            choices: { type: Array },
            explaination: {type: Array },
            answer_key: { type: String, required: true },
            is_answered: { type: Boolean, default: 0 },
            time_limit: { type: Number },
            //is_marked: { type: Boolean, default: 0 },
            is_mock: { type: Boolean, default: true }
        }
    ]
});
module.exports = mongoose.model('mock_exam', mock_exam);

