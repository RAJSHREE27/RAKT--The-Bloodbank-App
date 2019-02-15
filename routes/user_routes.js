const express = require('express');

const usermodel = require('../db/user/Usermodel.js');
const donormodel = require('../db/donor/Donormodel.js');
const bloodbankmodel = require('../db/bloodbank/Bloodbankmodel.js');
const router = express.Router();

router.post('/signup', function(req,res,next) {
    var userdata = req.body.user;
    var type = req.body.user.usertype;
    usermodel.create(userdata).then((user)=>{
      req.body.user = user._id;
      if(type === "donor"){
            donormodel.create(req.body).then(()=>{
            res.status(200).send({ success : true });
          });
       }
       else if(type === "bloodbank"){
         bloodbankmodel.create(req.body).then(()=>{
           res.status(200).send({ success : true });
         });
       }
    });
})

module.exports = router;
