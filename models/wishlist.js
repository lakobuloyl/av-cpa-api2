const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const wishlist = new Schema({
    user_id:{type: Schema.ObjectId, ref: 'user', required: true},
    wish_list : [{
        course_id: {type: Schema.ObjectId, ref: 'course', required: true}
    }]
});
module.exports = mongoose.model('wishlist', wishlist);
