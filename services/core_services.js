const jwt = require('jsonwebtoken'),
bcrypt = require('bcryptjs'),
User = require('../models/user');
passwordGenerator = require('generate-password'),

//for hashing password
exports.hashPassword = (password) => {
saltRounds = 10;
return bcrypt.hash(password, saltRounds).
    then(data => data).catch(err => {
        throw err
    });
};

//for comparing passwords

exports.comparePasswords = (passedPassword, storedPassword) => {
console.log(passedPassword, storedPassword);
return bcrypt.compare(passedPassword, storedPassword).
    then(data => data).catch(err => err);
};

//generate JWT access token
exports.generateAppAccessToken = (payload) => {
let key = "dsds";
return jwt.sign(payload, key, { expiresIn: '365d' });
};

const
findUser = (_id) => {
    return User.findById(_id).
        then(data => {
            return data;
        }).catch(err => {
            console.log(err);
        });
}



//validate JWT access token
exports.validateAppToken = (req, res, next) => {
    // console.log(req.headers);
    var
        token = req.headers['x-access-token'] || undefined,
        key = "dsds",
        //jwt verify callback
        verifyCb = (err, tokenData) => {
            if (!err) {
                const {_id } = tokenData;
                    findUser(_id).
                        then(data => {
                            if (data !== null) {
                                console.log("token success")
                                return next();
                            } else {
                                console.log(data)
                                res.send(403,{code:"Invalid User"});
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                } 
        };
    console.log("token",token)
    if (token) {
        jwt.verify(token, key, verifyCb);
    }
    else {
        res.send(403,{code:"Invalid Access token"});
    }
    };

exports.decodeToken = (token) => {
return jwt.decode(token);
}

//generate random password
exports.generateRandomPassword = function (strLength) {
    let password = passwordGenerator.generate({ length: strLength, numbers: true });
    return password;
    };
