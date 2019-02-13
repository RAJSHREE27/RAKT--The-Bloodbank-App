const mongoose = require('mongoose');
const userSchema = new mongoose.Schema ({
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
    bloodgroup: {
        type: String,
        enum: ['A+', 'B+', 'A-', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    dob: {
        type: Date,
        default: Date.now,
        required: true
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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;