const express = require('express');
const jwt = require('jsonwebtoken');

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

router.post('/login', async function( req , res ){
  let email = req.body.email;
  let password = req.body.password;
  let userobj = await usermodel.findOne({ email : email });
  if( email && password ){
      userobj.checkPassword(password , (err , ismatch) =>  {
        if(!err){
            let payload = {
               name : userobj.name,
               email : userobj.email,
               phone : userobj.phone,
               loc : userobj.loc,
               usertype : userobj.usertype

            };
            let token = jwt.sign( payload , process.env.secret , { expiresIn : '48h' });
            res.status(200).send({ success : true , token : token });
        }
      });
  }
});

module.exports = router;
