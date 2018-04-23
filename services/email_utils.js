const
sgHelper = require('sendgrid').mail,
KEY = process.env.SENDGRID_API_KEY,
sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

exports.sendEmail = function (from, to, subject, body, callback) {
let
    //configs
    sgFrom = new sgHelper.Email(from),
    sgTo = new sgHelper.Email(to),
    sgSubject = subject,
    sgContent = new sgHelper.Content('text/html', body),
    sgMail = new sgHelper.Mail(sgFrom, sgSubject, sgTo, sgContent),
  
    request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: sgMail.toJSON(),
    });

return sg.API(request).
    then(data => {
        return data;
    }).catch(err => {
        console.log(err)
        return err;y
       
    });
};


exports.newUsaerCreated = function (name,username, password) {
    return `
        <h3> Hello ${name}, your have created an account in Pinoy Review Center by the admin!</h3>
        <p>This is your Username <p/><br><br>
        <p>${username}<p/> <br><br>
        <p>This is your Password <p/><br><br>
        <p>${password}<p/> <br><br>
        <b>Check and login to https://prc-admin-cms.herokuapp.com/ </b>
    `;
};
exports.newAccountCreatedTemplate= function (name,username, password) {
    return `
        <h3> Hello ${name}, you have created an account in Pinoy Review Center!</h3>
        <p>This is your Username <p/><br><br>
        <p>${username}<p/> <br><br>
        <p>This is your Password <p/><br><br>
        <p>${password}<p/> <br><br>
        <b>Check and login to https://av-prc-client.herokuapp.com/ </b>
    `;
};

exports.changePassword = function (name, password)  {
    return `
        <h3> Hello ${name},You have changed your password. This is your new password: </h3> 
        <p>${password}<p/> <br><br>
        <b> Please login to  https://av-prc-client.herokuapp.com and check your password</b>
    `;
};
exports.changePasswordAdmin = function (name, password)  {
    return `
        <h3> Hello ${name},You have changed your password. This is your new password: </h3> 
        <p>${password}<p/> <br><br>
        <b> Please login to   https://prc-admin-cms.herokuapp.com/  and check your password</b>
    `;
};

exports.changeForgotPassworddAdmin = function (name, password)  {
    return `
        <h3> Hello ${name},You have requested for new password. This is your new password: </h3> 
        <p>${password}<p/> <br><br>
        <b> Please login to   https://prc-admin-cms.herokuapp.com/ and check your password</b>
    `;
};

