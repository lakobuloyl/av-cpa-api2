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

    const
    findArchivedAdmins = () => {
        return user.find({ 
            $and:  [ { "membership_type": { $ne: 0 } }, { "user_on_archive": 1 } ] 
        }).
        then(data => data).catch(err => {
            throw err;
        });
    },
    displayAdmins = (archived_admins) => {
        return archived_admins.map(admin => {
            const { _id, first_name, last_name, membership_type } = admin;
            return { _id, first_name, last_name, membership_type };
        });
    };

    async function main() {
        try {
            if(membership_type === 0) {
                var archived_admins = await findArchivedAdmins();
                var display_admins = await displayAdmins(archived_admins);

                res.send(200, {code: "SUCCESS", message: display_admins} );
            }
            else {
                res.send(403, {code: "FORBIDDEN", message: "Invalid Account Access"});
            }
        } catch (e) {
            console.log(e);
            res.send(500, {code: "FAILED", msg : "An error happened while getting archived admins ", e});
        }  
    }
    main();
}