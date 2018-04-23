const mongoose = require('mongoose'),
Schema = mongoose.Schema;


const exam_mock_session = new Schema({
    /// schema fr taking exam
        user_id: {type: Schema.ObjectId, ref: 'user_accounts'},
        users_mock:[{
            course_id:{type: Schema.ObjectId, ref: 'course'},
            mock_details:[{
                mock_no_of_items:{type:Number, default:0},
                mock_correct:{type: Number, default:0},
                mock_incorrect:{type: Number, default:0},
                mock_un_answered:{type: Number, default:0},
                mock_flagged:{type: Number, default:0},
                mock_id:{type:Schema.ObjectId, ref:'mock_exam'},
                mock_attempts:{type: Number, default:0},
                total_time:{type:Number, default:0},
                mock_questions:[{
                    quest_id:{type:Schema.ObjectId, ref:'mock_exam'},
                    answer_key:{type:String},
                    status:{type:Number, default:0},
                    is_flagged:{type:Number, default:0}
                }]
            }], /// end session details
            is_expired:{type:Boolean, default:0},
        }]
            
        
});
module.exports = mongoose.model('exam_mock_session', exam_mock_session);
