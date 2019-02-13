const express = require('express');
const bodyParser = require('body-parser');
const Bloodbank = require('../db/bloodbank/Bloodbankmodel');

const router = express.Router();

router.get('/', bodyParser.json(), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to bloodbank-collect backend"
    });
});

router.get('/signup', bodyParser.json(), (req, res) => {
    const saveData = new Bloodbank({
        name: 'BB1',
        email: 'sid@user.com',
        phone: '9424113605',
        bloodgroup: 'O+',
        dob: '855834011000',
    });
    saveData.save()
        .then(() => res.status(200).json({
            success: true,
            message: 'user saved successfully'
        }))
        .catch(error => {
            console.log(error);
            return res.status(400).json({
                success: 'false',
                error
            })
        })
})

module.exports = router;