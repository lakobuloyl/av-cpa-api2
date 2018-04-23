//this api is for displaying archived admins   
// API version 1
// earl

const mongoose = require('mongoose');
const user = require('../../../../../models/user'),
{
    decodeToken
}
 = require('../../../../../services/core_services');

module.exports = function(req, res, next){
    const { membership_type } = decodeToken(req.headers['x-access-token']);

    const getUser = (user_id) => {
        return user.findById(user_id).
        then(data => data).catch(err => {
            throw err;
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var get_user = await getUser(req.params._id);

                if(get_user.user_on_archive) {
                    if(get_user.membership_type ==! 0) {
                        await user.remove(get_user);
                        res.send(200, {code: "SUCCESS", message: "Successfully removed user." + get_user});
                    }
                    else {
                        res.send(409, {code: "CONFLICT", msg : "Cannot delete admin account."});
                    }
                }
                else {
                    res.send(409, {code: "CONFLICT", msg : "Cannot delete. User is not archived."});
                }
            }
            else {
                res.send(403, { code: "FORBIDDEN", message: "Invalid account access."} );
            }
        } 
        catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived admins ", e});
        }  
    }
    main();
}