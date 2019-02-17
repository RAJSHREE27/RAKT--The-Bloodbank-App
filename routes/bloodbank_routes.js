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

router.get('/allstocks', [ isAuthenticated , isBloodbank ] , (req, res , next )=>{
    console.log(req.decoded);
    bloodbank.find({}).populate('user', 'name', 'loc')
      .then((bloodbank)=>{
        Object.keys(bloodbank).map(function(key , index ){
          res.send({ bloodbank });
        });
    });

});

module.exports = router;
