const express = require('express');
const bodyParser = require('body-parser');
const Bloodbank = require('../db/bloodbank/Bloodbankmodel');
const sendNotification = require('../onesignal');

const router = express.Router();

router.get('/', bodyParser.json(), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to bloodbank-collect backend"
    });
});

router.use('/user',require('./user_routes'));

module.exports = router;
