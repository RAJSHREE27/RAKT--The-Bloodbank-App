const OneSignal = require('onesignal-node');
const { onesignal_user_auth_key, onesignal_app_auth_key, onesignal_app_id } = require('../config');

sendNotification = (contents = 'Body', headings = 'Title', data = {}) => {
    const myClient = new OneSignal.Client({    
        userAuthKey: onesignal_user_auth_key, 
        app: { appAuthKey: onesignal_app_auth_key, appId: onesignal_app_id }    
    });
    
    var firstNotification = new OneSignal.Notification({    
        contents: {    
            en: contents,        
        },
        headings: {
            en: headings
        },
        data,
        included_segments: ["Active Users"]
    });
    myClient.sendNotification(firstNotification)
        .then(({ data }) => {
            console.log(data);
            if(data.error) {
                return {
                    success: false,
                    error: data.error,
                    code: 500
                }
            }
            return {
                success: true,
                data,
                code: 200
            };
        })
        .catch(error => {
            console.log(error);
            return {
                success: false,
                error: 'Internal Server Error',
                code: 500
            };
        })
}

module.exports = sendNotification;
