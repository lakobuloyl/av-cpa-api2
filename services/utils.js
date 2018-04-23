const
mongoose = require('mongoose'),
Schema = require('mongoose').Schema;

const 
dbconn = (callback) => {
    var URI = process.env.MONGODB_URI;
    mongoose.connect(URI, { config: { autoIndex: false } }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
},
    convertUTCDateToLocalDate = () => {
        var daye = new Date(Date.now());
        var newDate = new Date(daye.getTime()+daye.getTimezoneOffset()*60*1000);

        var offset = daye.getTimezoneOffset() / 60;
        var hours = daye.getHours();

        newDate.setHours(hours - offset);

        return {
            type: Schema.Types.Date,
            default: newDate
        };   
    };
    refGen = (ref) => {
        return {
            type: Schema.Types.ObjectId,
            ref
        };
    },
    
module.exports = {
        refGen,
        dbconn,
        convertUTCDateToLocalDate
};
        