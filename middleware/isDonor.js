let isDonor = (req,res,next)=>{
  if (req.decoded.user.usertype === "donor"){
    next();
  }else{
    res.send({
      success : false,
      message : 'Unauthorized token'
    });
  }
}

module.exports = isDonor
