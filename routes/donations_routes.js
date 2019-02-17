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

const candonate={
  "A+":["A+","A-","O+","O-"],
  "A-":["A-","O-"],
  "B+":["B+","B-","O+","O-"],
  "B-":["B-","O-"],
  "O+":["O+","O-"],
  "O-":["O-"],
  "AB+":["AB+","AB-","B+","B-","A+","A-","O+","O-"],
  "AB-":["AB-","B-","A-","O-"]
}

router.post('/write',[isAuthenticated],function(req,res){
  var donor_user = req.decoded;
  if(donor_user.user.usertype=="donor"){
    var lastdonatedat;
    usermodel.findOne({_id:donor_user.user._id}).then((user)=>{
      if (!user.lastdonatedat){
        lastdonatedat = '0'
      }else{
        lastdonatedat = user.lastdonatedat;
      }
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
                  success: true,
                  message : `You successfully donated to ${user.name}`
                });
              });
            });
          }else if (user.usertype==="donor"){
            var newdonationsobj={
              donor : donor_user.user._id,
              recipient : user._id,
              quantity : req.body.quantity
            }
            usermodel.findOne({phone:req.body.phone}).then((user)=>{
              donormodel.findOne({user:user._id}).then((donor_who_receives)=>{
                if(candonate[donor_who_receives.bloodgroup].includes(donor_user.bloodgroup)){
                  donationmodel.create(newdonationsobj).then((donation)=>{
                    usermodel.findOne({_id:donor_user.user._id}).then((user)=>{
                      user.lastdonatedat=Date.now();
                      user.save();
                      return res.send({
                        success : true,
                        message : `You successfully donated to ${user.name}`
                      });
                    });
                  })
                }else{
                  return res.send({
                    success : false,
                    message : `Incompatible blood types`
                  });
                }
              });
            });
          }
        });
      }else{
        return res.send({
          success : false,
          message : "Not 3 month since last donation"
        });
      }
    });
  }else if(donor_user.user.usertype=="bloodbank"){
    usermodel.findOne({phone:req.body.phone}).then((user)=>{
      donormodel.findOne({user:user._id}).then((donor)=>{
        var req_bloodtype = mapping[donor.bloodgroup];
        bloodbankmodel.findOne({user : donor_user.user._id}).then((bloodbank)=>{
          if(bloodbank.stock[req_bloodtype] >= req.body.quantity){
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


router.get('/find',[isAuthenticated],function(req,res){
  donationmodel.find({donor:req.decoded.user._id}).populate('donor').populate('recipient').then((donations_as_donor)=>{
    donationmodel.find({recipient:req.decoded.user._id}).populate('donor').populate('recipient').then((donations_as_recepient)=>{
        res.status(200).send({
        success:true,
        donated : donations_as_donor,
        received : donations_as_recepient
      });
    });
  });
});



module.exports = router;
