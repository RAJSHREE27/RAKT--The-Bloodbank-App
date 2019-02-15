// just for testing purpose


const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/api',(req,res)=>{
  res.json({
    message : 'welcome to api'
  });
});

router.post('/api/post', verifyToken ,(req,res)=>{
  jwt.verify(req.token, 'secretkey', (err,authData)=>{
     if(err){
       res.sendStatus(403);
     }else{
       res.json({
         message : 'new post created' ,
         authData
       });
    }
  });


});

router.post('/api/login',(req,res)=>{
  const user = {
    name : 'rajshree',
    semester : 'sixth',
    email : 'rajshreegavel111@gmail.Welcome'
  }
  jwt.sign({user}, 'secretkey',{ expiresIn : '10s'}, (err, token) =>{
    res.json({
      token
    });
  });
});

function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !==  'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }else{
    //forbidden
    res.sendStatus(403);
  }
}
module.exports = router;
