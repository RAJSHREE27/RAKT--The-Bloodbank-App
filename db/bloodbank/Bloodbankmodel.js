const mongoose = require('mongoose');
const bloodbankSchema = new mongoose.Schema ({

   user :{
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true,
     unique : true
   },
    stock: {
        ap: {
            type: Number,
            default: 0
        },
        an: {
            type: Number,
            default: 0
        },
        bp: {
            type: Number,
            default: 0
        },
        bn: {
            type: Number,
            default: 0
        },
        abp: {
            type: Number,
            default: 0
        },
        abn: {
            type: Number,
            default: 0
        },
        op: {
            type: Number,
            default: 0
        },
        on: {
            type: Number,
            default: 0
        }
    },
    address : {
      housenumber : {
        type : String
      },
      city : {
        type : String
      },
      state : {
        type : String
      },
      country : {
        type : String
      },
      zip :{
        type : String
      }
    }
} , { timestamps : true } );

const Bloodbank = mongoose.model('Bloodbank', bloodbankSchema);
module.exports = Bloodbank;
