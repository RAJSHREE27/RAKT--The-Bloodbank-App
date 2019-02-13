const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({

   user_id : {
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true
   },
  bloodbank_id : {
     type : mongoose.Schema.ObjectId,
     ref : 'Bloodbank' ,
     required  : true
   } ,
  timestamp :{
     type : Date,
     default : Date.now
   },
  quantity : {
     type : Number,
     default : 1,
     min: 1,
     match : [/^\d+$/, 'Please fill a valid quantity']
   }

});

const Donations = mongoose.model('Donations', donationSchema);
module.exports = Donations
