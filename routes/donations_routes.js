const express = require('express');
const isAuthenticated = require('../middleware/IsAuthenticated');
const usermodel = require('../db/user/Usermodel');
const donationmodel = require('../db/donations/Donationmodel');
const donormodel = require('../db/donor/Donormodel.js');
const bloodbankmodel = require('../db/bloodbank/Bloodbankmodel.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

const mapping = {
  "A+":"ap",
  "A-":"an",
  "B+":"bp",
  "B-":"bn",
  "O+":"op",
  "O-":"on",
  "AB+":"abp",
  "AB-":"abn"
}

router.post('/write',[isAuthenticated],function(req,res){
  var donor_user = req.decoded;
  var recipient_user;
  var recipient_phone = req.body.phone;
  jwt.verify(req.body.recipient, process.env.SECRET , (err , decoded)=>{
    recipient_user = decoded;
  });
  console.log(recipient_user);
  if(donor_user.user.usertype=="donor"){
    var lastdonatedat;
    usermodel.findOne({_id:donor_user.user._id}).then((user)=>{
      lastdonatedat = user.lastdonatedat;
      timeafterlastdonation= Date.now() - new Date(lastdonatedat).getTime();
      if (timeafterlastdonation>=(7776000000)){
        usermodel.findOne({phone:req.body.phone}).then((user)=>{
          if (user.usertype==="bloodbank"){
            var newdonationsobj={
              donor : donor_user.user._id,
              recipient : user._id,
              quantity : req.body.quantity
            }
            donationmodel.create(newdonationsobj).then((donation)=>{
              bloodbankmodel.findOne({user:user._id}).then((bloodbank)=>{
                donatedbloodgroup = mapping[donor_user.bloodgroup]
                bloodbank.stock[donatedbloodgroup]+=parseInt(req.body.quantity);
                bloodbank.save();
                user.lastdonatedat = Date.now();
                user.save();
                res.status(200).send({
                  sucess: true,
                  message : "User to Blood Bank Donation Successful"
                });
              });
            });
          }else if (user.usertype==="donor"){
            var newdonationsobj={
              donor : donor_user.user._id,
              recipient : user._id,
              quantity : req.body.quantity
            }
            donationmodel.create(newdonationsobj).then((donation)=>{
              usermodel.findOne({_id:donor_user.user._id}).then((user)=>{
                user.lastdonatedat=Date.now();
                user.save();
                return res.send({
                  success : true,
                  message : "User to User Donation Successful"
                });
              });
            })
          }
        });
      }else{
        console.log("inhere");
        return res.send({
          success : false,
          message : "Not 6 month since last donation"
        });
      }
    });
  }else if(donor_user.user.usertype=="bloodbank"){
    usermodel.findOne({phone:req.body.phone}).then((user)=>{
      donormodel.findOne({user:user._id}).then((donor)=>{
        var req_bloodtype = mapping[recipient_user.bloodgroup];
        bloodbankmodel.findOne({user : donor_user.user._id}).then((bloodbank)=>{
          if(bloodbank.stock[req_bloodtype] > req.body.quantity){
            bloodbank.stock[req_bloodtype]-=req.body.quantity;
            bloodbank.save();
            res.send({
              success : true,
              message : "Bloodbank to User donation successful"
            });
          }else{
            res.send({
              success : false,
              message : `Bloodbank does not have enough stock of ${req_bloodtype}`
            });
          }
        });
      });
    });
  }
});



module.exports = router;