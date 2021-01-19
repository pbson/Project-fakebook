const FCM = require('fcm-node')
const serverKey = require('../facebook-clone-f7f11-firebase-adminsdk-otewb-786a31c917.json') //put the generated private key path here    
const User = require("../models/User");
const Notification = require("../models/Notification");
const { Expo } = require('expo-server-sdk');
const request = require('request');
const { compareSync } = require('bcryptjs');

let fcm = new FCM(serverKey)

async function getUserDeviceToken(userId) {
    let user = await User.findOne({ _id: userId });
    if (!user.uuid) {
        return false
    } else {
        return user.uuid
    }
}

async function setNotification(type, objectId, title, group, avatar, userId) {
    //Add new data
    let addNotification = {
        type: type,
        object_id: objectId,
        title: title,
        created: Date.now(),
        group: group,
        avatar: avatar,
        user_id: userId,
        read: false
    }
    try {
        let newNotification = new Notification(addNotification);
        await newNotification.save();
    } catch (error) {
        console.log(error);
    }
}

function newCommentNotification(receiverDeviceToken, sender, postId,userId) {
    let messages = {
        to: receiverDeviceToken,
        title: 'New comment on your post',
        body: `${sender} have commented on your post`,
        data: {
            postId: postId,
            group: 0
        },
    }

    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });
    let iconUrl = 'https://res.cloudinary.com/pbson639/image/upload/v1611080830/facebook-comment-icon-png-11_jwlqvc.png'
    setNotification('comment',postId,messages.title,0,iconUrl,userId )

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Push unsuccesful!")
    //     } else {
    //         console.log("Successfully sent with response: ", response)
    //     }
    // })
}

function newPostNotification(receiverDeviceToken, sender, postId) {
    if (!Expo.isExpoPushToken(receiverDeviceToken)) {
        console.error(`Push token ${receiverDeviceToken} is not a valid Expo push token`);
    }

    let messages = [{
        to: receiverDeviceToken,
        title: `${sender} has a new post`,
        sound: "default",
        data: {
            id: postId,
            type: 'newPost'
        },
    }]

    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });
}

function newPostLikeNotification(receiverDeviceToken, sender, postId) {
    let messages = {
        to: receiverDeviceToken,
        title: 'New like on your post',
        body: `${sender} has liked your post`,
        data: {
            postId: postId,
        }
    }

    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Push unsuccesful")
    //     } else {
    //         console.log("Successfully sent with response: ", response)
    //     }
    // })
}

function newMessageNotification(receiverDeviceToken, sender, conversationId) {
    let messages = {
        to: receiverDeviceToken,
        title: 'New message',
        body: `${sender} have sent you a message`,
        data: {
            conversationId: conversationId,
        }
    }

    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Push unsuccesful")
    //     } else {
    //         console.log("Successfully sent with response: ", response)
    //     }
    // })
}

function newFriendRequest(receiverDeviceToken, sender, senderId) {
    console.log('abc')
    let messages = {
        to: receiverDeviceToken,
        title: 'New friend request',
        body: `${sender} have sent you a friend request`,
        data: {
            senderId: senderId,
        }
    }

    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Push unsuccesful")
    //     } else {
    //         console.log("Successfully sent with response: ", response)
    //     }
    // })
}

function acceptFriendsRequest(receiverDeviceToken, sender, isAccept) {
    let message;
    if (isAccept) {
        messages = {
            to: receiverDeviceToken,
            title: `${sender} have accepted your a friend request`
        }
    } else {
        messages = {
            to: receiverDeviceToken,
            title: `${sender} have denied your a friend request`
        }
    }


    request({
        url: `https://exp.host/--/api/v2/push/send`,
        method: "POST",
        headers: [
            {
                'host': 'exp.host',
                'accept': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'content-type': 'application/json'
            }
        ],
        json: messages,
    }, async function (error, response) {
        console.log(error);
        console.log(response.body);
    });

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Push unsuccesful")
    //     } else {
    //         console.log("Successfully sent with response: ", response)
    //     }
    // })
}
module.exports = { newCommentNotification, getUserDeviceToken, newPostLikeNotification, newMessageNotification, newPostNotification, newFriendRequest, acceptFriendsRequest }