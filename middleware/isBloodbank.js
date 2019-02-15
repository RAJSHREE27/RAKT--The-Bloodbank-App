let isBloodbank = (req,res,next)=>{
  if (req.decoded.user.usertype === "bloodbank"){
    next();
  }else{
    res.send({
      success : false,
      message : 'Unauthorized token'
    });
  }
}

module.exports = isBloodbank;
