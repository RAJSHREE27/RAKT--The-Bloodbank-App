const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        unique: true,
        match: [/^\d+$/, 'Please fill a valid phone number']
    },
    loc: {
        lat: {
            type: String,
            default: '0'
        },
        long: {
            type: String,
            default: '0'
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationnumber: {
        type: String,
        minlength: 1,
        default: '0000000000'
    },
    usertype :{
        type : String,
        required : true,
        enum: ['donor', 'bloodbank']
    },
    isactive :{
      type : Boolean,
      default : true
    },
    notification_tag:{
      type : String
    }
}, { timestamps : true });

userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){
      return next();
    }
    bcrypt.hash(user.password, 10).then((hashedPassword)=>{
      user.password = hashedPassword;
      return next();
    });

} , function(err){
    next(err);
});

userSchema.methods.checkPassword = function(candidatePassword , next){
    bcrypt.compare(candidatePassword , this.password, function(err, isMatch) {
        if(err){
          return next(err);
        }
        next(null , isMatch);
    });
}

// forward in code = 'database-table name' , schema name
const User = mongoose.model('User', userSchema);
module.exports= User;
