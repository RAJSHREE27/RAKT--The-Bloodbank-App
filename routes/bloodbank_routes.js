const express = require('express');
const isAuthenticated = require('../middleware/IsAuthenticated');
const isBloodbank = require('../middleware/isBloodbank');
const bloodbank = require('../db/bloodbank/Bloodbankmodel');
const router = express.Router();

router.get('/stock', [ isAuthenticated , isBloodbank ] , (req, res, next)=>{
    console.log(req.decoded);
    let user = req.decoded.user._id;
    console.log(user);
    bloodbank.findOne({ user }).then((bloodbank) =>{
      console.log(bloodbank);
      res.send(bloodbank.stock);
    });
});

router.get('/allstocks', [ isAuthenticated ] , (req, res , next )=>{
    bloodbank.find({}).populate('user')
      .then((bloodbank)=>{
          res.send({bloodbank});
    });

});

router.post('/updatestock', [ isAuthenticated, isBloodbank ], (req , res , next)=>{
  let bloodbank_stock = req.body.stock;
  bloodbank.findOne({ user : req.decoded.user._id  }).then((bb)=>{
    bb.stock = bloodbank_stock;
    bb.save();
    res.status(200).send({
      success : true ,
       message : "stock updated successfully"
     });
  });

});

module.exports = router;
