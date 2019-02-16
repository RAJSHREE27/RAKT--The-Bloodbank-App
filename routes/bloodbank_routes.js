const express = require('express');
const isAuthenticated = require('../middleware/IsAuthenticated');
const isBloodbank = require('../middleware/isBloodbank');
const bloodbank = require('../db/bloodbank/Bloodbankmodel');
const router = express.Router();

router.get('/allstocks', [ isAuthenticated , isBloodbank ] , (req, res, next)=>{
    console.log(req.decoded);
    let user = req.decoded.user._id;
    console.log(user);
    bloodbank.findOne({ user }).then((bloodbank) =>{
      console.log(bloodbank);
      res.send(bloodbank.stock);
    });
});

module.exports = router;
