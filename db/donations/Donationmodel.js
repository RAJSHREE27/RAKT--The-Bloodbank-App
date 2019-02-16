const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({

   donor : {
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true
   },
   recipient: {
     type : mongoose.Schema.ObjectId,
     ref : 'User' ,
     required  : true
   },
   quantity :{
     type : Number,
     default : 1,
     min : 1
   },
   date : {
     type : Date,
     default : Date.now()
   }

} , { timestamps : true });

const Donations = mongoose.model('Donations', donationSchema);
module.exports = Donations;
