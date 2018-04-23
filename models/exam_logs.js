const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const exam_logs = new Schema({
    exam_mode:{type:String},
    exam_name:{type:String},
    is_done:{type: Number, default:0},
    user_id:{type: Schema.ObjectId, ref: 'user'},
    course_id: {type: Schema.ObjectId, ref: 'course'},
    exam_date:{type:Date, default: new Date(Date.now())},
    correct: {type: Number, default: 0},
    incorrect: {type: Number, default: 0},
    skipped:{type:Number, default:0},
    flagged:{type:Number, default:0},
    total: {type: Number, default: 0},
    answered:{type: Number, default: 0},
    progress:{type: Number, default:0},
    session_details:[],
    duration:{type:Number, default:0},
    mock_exam_id: {type: String, default: ""}

});
module.exports = mongoose.model('exam_logs', exam_logs);
