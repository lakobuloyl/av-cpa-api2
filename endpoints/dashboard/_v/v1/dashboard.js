//this api is for dashboard   
// API version 2 
// junryl

const mongoose = require('mongoose');

const
assessment = require('../../../../models/assessment'),
course = require('../../../../models/course'),
lessons = require('../../../../models/lessons'),
questions = require('../../../../models/questions'),
users = require('../../../../models/user'),
exam_sessions = require('../../../../models/exam_sessions'),
{
    convertUTCDateToLocalDate 
} = require('../../../../services/utils')

module.exports = (req, res, next) => {

const
    getUsersRegistered = () => {
        return users.find({membership_type: 2,user_on_archive:0}) // user only 
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    conpareDate = (user_registered) =>
    {
        var January=February = March = April =  May =  June = July =  August =  September = October =  November = December= 0,
         date_now = new Date(Date.now())
        
        for(var i = 0; i<user_registered.length; i++)
        {
           
            var Date_fetched =  new Date(user_registered[i].membership_reg_date)
            
            if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 0)
            {
                ++January
            }
           else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 1)
            {
                ++February
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 2)
            {
                ++March
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 3)
            {
                ++April
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 4)
            {
                ++May
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 5)
            {
                ++June
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 6)
            {
                ++July
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 7)
            {
                ++August
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 8)
            {
                ++September
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 9)
            {
                ++October
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 10)
            {
                ++November
            }
            else if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === 11)
            {
                ++December
            }
        }
        return [
            January, February ,March ,April ,May ,  June, July,  August,  September, October,  November, December
           
            ]
    },

    getNumberExaminees = (user_registered) => {
        date_now = new Date(Date.now())
        for(var i = 0; i<user_registered.length; i++)
        {
            var count_examinees = 0;
            var Date_fetched =  new Date(user_registered[i].membership_reg_date)
            
            if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === date_now.getMonth() && user_registered.user_exam_taken === 1)
            {
                ++count_examinees
            }
            return count_examinees
        }
    },
    getUserRegisteredPerMonth = (user_registered) =>
    {
        date_now = new Date(Date.now())
        var result =0;
        for(var i = 0; i<user_registered.length; i++)
        {
            
            var Date_fetched =  new Date(user_registered[i].membership_reg_date)
             if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === date_now.getMonth() )
            {
                ++result
            }
        }
        return result

    },
    getExamNo = () => {
        return exam_sessions.find({}) // user only 
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    getExamPerMonth = (no_exams) =>
    {
        date_now = new Date(Date.now())
        for(var i = 0; i<no_exams.length; i++)
        {
            var count_exam = 0;
            var Date_fetched =  new Date(no_exams.start_date)
            if (date_now.getFullYear() === Date_fetched.getFullYear() && Date_fetched.getMonth() === date_now.getMonth())
            {
                ++count_exam
            }
            return count_exam
        }
    },
    sendSuccess = (res, data, msg) => {
        res.send(200, {
            data,
            msg,
        });
    };
async function main() {
    try {
        
        var user_registered = await getUsersRegistered();
        
        var examinees = await getNumberExaminees(user_registered);
        var no_of_users = await conpareDate(user_registered)
        var no_of_users_per_month = await getUserRegisteredPerMonth(user_registered)
      
        var no_exams = await getExamNo()
        var exam_count = await getExamPerMonth(no_exams)
        sendSuccess(
            res,
            { examinees,no_of_users,exam_count,no_of_users_per_month },
            "Dashboard successfully Fetched!"
        );
    }
    catch (e) {
        console.log(e);
        sendError(res, e);
    }
}
main();
}