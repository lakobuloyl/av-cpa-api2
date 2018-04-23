//this api is for ``
// API version 2 
// junryl

const mongoose = require('mongoose');
const wishlist = require('../../../../../models/wishlist');
const {   decodeToken} = require('../../../../../services/core_services');

module.exports = function(req,res,next){
    const { _id } = decodeToken(req.headers['x-access-token']);
    const
    getWishList = () => {
        return wishlist.findOne({user_id:_id})
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    wishExist = () => {
        return wishlist.findOne({
                wish_list:{
                    $elemMatch:{
                        course_id: req.params.course_id
                    }
                }
            }
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    },
    saveWishlist = () =>{
        var set_wish = {
            user_id:_id,
            wish_list:[{
                course_id:req.params.course_id
            }]
        }
       var new_wishlist =  wishlist.create(set_wish);
       return new_wishlist
    }
    updateWishList = (get_wishlist) => {
        var resp = 0;
        var wish_array = get_wishlist.wish_list
        for(var i=0; i<wish_array.length; i++){
            if(wish_array[i].course_id.toString() === req.params.course_id.toString()){
                if(req.body.status === 2){
                    wish_array.splice(i, 1)
                }else{
                    resp = 1;
                }
            }
        }
        if(resp === 0){
            return wishlist.findOneAndUpdate({user_id:_id},
           { $set:
            {wish_list:wish_array}}
            )
            then(data => {
                return data;
            }).catch(err => {
                throw err;
            });
        }else{
            return resp
        }
        
    },
    newWish = (get_wishlist)=>{
        var wish_array = get_wishlist.wish_list;
        wish_array.push({course_id:req.params.course_id})
        return wishlist.findOneAndUpdate({user_id:_id},
            { $set:
                {wish_list:wish_array}}
        )
        then(data => {
            return data;
        }).catch(err => {
            throw err;
        });
    };
    async function main() {

        try {
            var get_wishlist = await getWishList();
            if(get_wishlist){
                var wish_exist = await wishExist()
                if(wish_exist){
                    var update_wish = await updateWishList(get_wishlist);
                    if(update_wish === 1){
                        res.send(409, {code: "CONFLIC", msg : "This course is already in the wish list", });
                    }else{
                        res.send(200, {code: "SUCCESS", msg : "SUCCESSFULLY remove to your wishlist", });
                    }
                }else{
                    if(req.body.status === 1){
                        var save_new = await newWish(get_wishlist)
                        res.send(200, {code: "SUCCESS", msg : "SUCCESSFULLY added to your wishlist", });
                    }else{
                        res.send(404, {code: "NOT FOUND", msg : "this course is not added in your wishlist", });
                    }
                    
                }
            }else{
                 var save_wishlist = await saveWishlist();
                 res.send(200, {code: "SUCCESS", msg : "SUCCESSFULLY added to your wishlist", });
            }
               
             
        } catch (e) {
            console.log(e);
            res.send(500, {code: "Failed", msg : "An error happened while retrieving lessons", e});
        }
    }

    main ();
}