const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) =>{
   let token = req.headers['authorization'] || req.headers['x-access-token'];
   if(token){
     if(token.startsWith('Bearer ')){
       token = token.slice(7 , token.length);

     }
     jwt.verify(token, process.env.SECRET , (err , decoded)=>{
       if(err){
         return res.json({
           success : false,
           message : " token is not valid "
         });
       }else{
         req.decoded = decoded;
         next();
       }
     });
   }else{
     return res.json({
       success : false ,
       message : " auth token is not supplied "
     });
   }

};

module.exports = verifyToken;
