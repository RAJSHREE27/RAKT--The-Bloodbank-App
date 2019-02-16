const mongoose = require('mongoose');
const donorSchema = new mongoose.Schema ({

  user :{
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true,
     unique : true
   },
   bloodgroup: {
        type: String,
        enum: ['A+', 'B+', 'A-', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required : true
    },
    dob: {
        type: Date,
        required: true
    }
} , { timestamps : true});

const Donor = mongoose.model('Donor', donorSchema);
module.exports = Donor;
