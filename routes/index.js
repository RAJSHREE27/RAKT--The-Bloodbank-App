const express = require('express');
const bodyParser = require('body-parser');
const sendNotification = require('../onesignal');

const router = express.Router();

router.get('/', bodyParser.json(), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to bloodbank-collect backend"
    });
});

router.use('/user',require('./user_routes'));
router.use('/bloodbank', require('./bloodbank_routes'));
router.use('/donations', require('./donations_routes'));
router.use(require('./notifications'));


module.exports = router;
