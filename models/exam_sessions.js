const mongoose = require('mongoose'),
Schema = mongoose.Schema;


const exam_session = new Schema({
    /// schema fr taking exam
        user_id: {type: Schema.ObjectId, ref: 'user_accounts'},
        session_details:[{
            is_expired:{type:Boolean, default:0},
            course_id:{type: Schema.ObjectId, ref: 'course'},
            is_taken:{type:Boolean, default:0},
            no_of_items:{type:Number, default:0},
            correct_course:{type: Number, default:0},
            incorrect_course:{type: Number, default:0},
            un_answered:{type: Number, default:0},
            flagged_course:{type:Number, default:0},
            date_registered:{type:Date},
            date_expiration:{type:String},
            completion_c:{type: Number, default:0},
            assessment:[{
                assessment_id:{type: Schema.ObjectId, ref: 'assessment'},
                no_of_items:{type:Number, default:0},
                correct_assess:{type: Number, default:0},
                incorrect_assess:{type: Number, default:0},
                un_answered:{type: Number, default:0},
                flagged_assess:{type:Number, default:0},
                completion_a:{type: Number, default:0},
                lessons:[{
                    lesson_id: {type: Schema.ObjectId, ref: 'lessons'},
                    no_of_items:{type:Number, default:0},
                    correct_lesson:{type: Number, default:0},
                    incorrect_lessons:{type: Number, default:0},
                    un_answered:{type: Number, default:0},
                    flagged_lesson:{type:Number, default:0},
                    completion_l:{type: Number, default:0},
                    lesson_details:[{
                        question_id:{type: Schema.ObjectId, ref: 'questions'},
                        status:{type:Number, default:0}, // 0 un answered 1 correct 2 incorrect
                        is_flagged:{type:Number, default:0}
                    }]
                }]
            }],
            payment_details:{}
        }], /// end session details

        
});
module.exports = mongoose.model('exam_session', exam_session);
