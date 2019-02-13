const mongoose = require('mongoose');
const bloodbankSchema = new mongoose.Schema ({
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
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        required: true,
        unique: true,
        match: [/^\d+$/, 'Please fill a valid phone number']
    },
    verified: {
        type: Boolean,
        default: false
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
    verificationnumber: {
        type: String,
        minlength: 1,
        default: '0000000000'
    }
});

const Bloodbank = mongoose.model('Bloodbank', bloodbankSchema);

module.exports = Bloodbank;