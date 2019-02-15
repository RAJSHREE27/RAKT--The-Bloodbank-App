const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({

   donor_id : {
     type : mongoose.Schema.ObjectId,
     ref : 'Donor',
     required : true
   },
   bloodbank_id : {
     type : mongoose.Schema.ObjectId,
     ref : 'Bloodbank' ,
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
