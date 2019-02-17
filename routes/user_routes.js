const express = require('express');
const jwt = require('jsonwebtoken');

const usermodel = require('../db/user/Usermodel.js');
const donormodel = require('../db/donor/Donormodel.js');
const isAuthenticated = require('../db/donor/Donormodel.js');
const bloodbankmodel = require('../middleware/IsAuthenticated.js');
const router = express.Router();

router.post('/signup', function(req,res,next) {
    var userdata = req.body.user;
    var type = req.body.user.usertype;
    usermodel.create(userdata).then((user)=>{
      req.body.user = user._id;
      if(type === "donor"){
            donormodel.create(req.body).then((donor)=>{
              var payload = {
                user : {
                  _id : user._id,
                  name : user.name,
                  email : user.email,
                  phone : user.phone,
                  loc : user.loc,
                  usertype : user.usertype,
                  lastdonatedat : user.lastdonatedat
                  },
                  bloodgroup : donor.bloodgroup,
                  dob : donor.dob,
              };
              let token = jwt.sign( payload , process.env.SECRET , { expiresIn : '48h' });
              res.status(200).send({
                success : true,
                token : token,
                payload : payload,
              });
          });
       }
       else if(type === "bloodbank"){
         bloodbankmodel.create(req.body).then((bloodbank)=>{
           var payload = {
             user : {
               _id : user._id,
               name : user.name,
               email : user.email,
               phone : user.phone,
               loc : user.loc,
               usertype : user.usertype
             },
             address : bloodbank.address,
           };
           let token = jwt.sign( payload , process.env.SECRET , { expiresIn : '48h' });
           res.status(200).send({
             success : true ,
             token : token ,
             payload : payload
           });
         });
       }
    });
})

router.post('/login', async function( req , res ){
  let email = req.body.email;
  let password = req.body.password;
  let phone = req.body.phone;
  let userobj;
  if(email){
    userobj = await usermodel.findOne({ email : email });
  }else if(phone){
    userobj = await usermodel.findOne({ phone : phone });
  }else{
    res.send({
      success : false,
      message : 'Missing keys!'
    })
  }
  let usertype = userobj.usertype;
  if( userobj && password ){
      userobj.checkPassword(password , async (err , ismatch) =>  {
        if(!err){
            if (usertype==="donor"){
              let userprofile = await donormodel.findOne({ user : userobj._id });
              var payload = {
                user : {
                  _id : userobj._id,
                  name : userobj.name,
                  email : userobj.email,
                  phone : userobj.phone,
                  loc : userobj.loc,
                  usertype : userobj.usertype,
                  lastdonatedat : userobj.lastdonatedat
                  },
                  bloodgroup : userprofile.bloodgroup,
                  dob : userprofile.dob,
              };
            }else if (usertype==="bloodbank"){
              let userprofile = await bloodbankmodel.findOne({ user : userobj._id });
              var payload = {
                user : {
                  _id : userobj._id,
                  name : userobj.name,
                  email : userobj.email,
                  phone : userobj.phone,
                  loc : userobj.loc,
                  usertype : userobj.usertype
                },
                address : userprofile.address,
              };
            }
            let token = jwt.sign( payload , process.env.SECRET , { expiresIn : '48h' });
            res.status(200).send({ success : true , token : token , payload:payload });
        }
      });
  }
});

router.post('/notification/set',[ isAuthenticated ] , function(req, res){
  console.log(req.decoded);
  let notif = req.body.notification_tag;
  let locc = req.body.loc;
  console.log(notif);
  usermodel.findOne({ _id : req.decoded.user._id }).then((user)=>{
    user.notification_tag = notif;
    user.loc = locc;
    user.save();
    res.status(200).send({
      success : true,
      message : "notification token saved successfully "
    });
  });


});


module.exports = router;
