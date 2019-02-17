const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema ({
   sender : {
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true
   },
   reciever : {
     type : mongoose.Schema.ObjectId,
     ref : 'User',
     required : true
   },
   notification_body :{
     type : String,
     required : true
   },
   notification_data : {
     type : Object,
     required : true
   }
}, { timestamps : true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports= Notification;
