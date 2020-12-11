const FCM = require('fcm-node')
const serverKey = require('../facebook-clone-f7f11-firebase-adminsdk-otewb-786a31c917.json') //put the generated private key path here    
const User = require("../models/User");

let fcm = new FCM(serverKey)

async function getUserDeviceToken (userId) {
    let user = await User.findOne({ _id: userId });
    if (!user.uuid) {
        return false
    }else {
        return user.uuid
    }
}

function newCommentNotification (receiverDeviceToken, sender, postId) {

    let message = {
        to: receiverDeviceToken, 
        
        notification: {
            title: 'New comment on your post', 
            body: `${sender} have commented on your post` 
        },
        
        data: {
            postId: postId,
        }
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}

function newPostLikeNotification(receiverDeviceToken, sender, postId) {
    let message = {
        to: receiverDeviceToken, 
        
        notification: {
            title: 'New like on your post', 
            body: `${sender} have like your post` 
        },
        
        data: {
            postId: postId,
        }
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}

function newMessageNotification(receiverDeviceToken, sender, conversationId){
    let message = {
        to: receiverDeviceToken, 
        
        notification: {
            title: 'New message', 
            body: `${sender} have sent you a message` 
        },
        
        data: {
            conversationId: conversationId,
        }
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}

module.exports = { newCommentNotification, getUserDeviceToken, newPostLikeNotification, newMessageNotification }