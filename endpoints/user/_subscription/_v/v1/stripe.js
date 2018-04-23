//this api is for deisplaying of roles   
// API version 2 
// junryl

const mongoose = require('mongoose');
var stripe = require('stripe')('sk_test_...');
module.exports = function(req,res,next){
     
    const
    createRecord = () => {
        stripe.customers.create({
            email: req.body.email
          }).then(function(customer){
            return stripe.customers.createSource(customer.id, {
              source: req.body.card_type
            });
          }).then(function(source) {
            return stripe.charges.create({
              amount: req.body.total_amount,
              description:'books Products',
              currency: 'Php',
              customer: source.customer
            });
          }).then(function(charge) {
            // New charge created on a new customer
          }).catch(function(err) {
            // Deal with an error
          });
    }
    async function main() {
        try {
            var create_record = await createRecord();
        //    res.send(200, {code: "Success", msg : "Roles retrieved", roles});
        } catch (e) {
            res.send(500, {code: "Failed", msg : "An error happened while retrieving roles", e});
        }
    }

    main ();
}