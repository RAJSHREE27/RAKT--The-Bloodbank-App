const { Expo } = require('expo-server-sdk');
const express = require('express');
const isAuthenticated = require('../middleware/IsAuthenticated');
const usermodel = require('../db/user/Usermodel');




let expo = new Expo();
const router = express.Router();


router.post('/pushnotification',[isAuthenticated],async function(req,res){
  let somePushTokens = [];
  for (let phone of req.body.phonenumbers){
    user = await usermodel.findOne({phone:phone})
    console.log(user);
    somePushTokens.push(user.notification_tag);
  }
  let messages = [];
  for(let pushToken of somePushTokens){
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      res.send({
        success : false,
        message : 'Error occurred'
      })
      continue;
    }
    messages.push({
      to: pushToken,
      sound: 'default',
      body: `${req.decoded.user.name} sent you a request for bloodgroup ${req.body.bloodgroup}`,
      data: { loc : req.body.loc },
      android:{
        channelId : 'bloodbank'

      }
    })
  }
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
      for (let chunk of chunks) {
          try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
              res.send({
                success : false,
                message : 'Error occurred'
              })
            }
      }
  })();
  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }
  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);
        for (let receipt of receipts) {
          if (receipt.status === 'ok') {
            continue;
          } else if (receipt.status === 'error') {
            console.error(`There was an error sending a notification: ${receipt.message}`);
            res.send({
              success : false,
              message : 'Error occurred'
            })
            if (receipt.details && receipt.details.error) {
              console.error(`The error code is ${receipt.details.error}`);
              res.send({
                success : false,
                message : 'Error occurred'
              })
            }
          }
        }
      } catch (error) {
        console.error(error);
        res.send({
          success : false,
          message : 'Error occurred'
        })
      }
    }
  })();
  res.send({
    success : true,
    message : 'Notifications sent successfully'
  })

});

module.exports = router;
