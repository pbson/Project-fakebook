const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const Comment = require("../../models/Comment");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const Post = require("../../models/Post");

router.post("/set_read_notification", async (req, res) => {
    const { token, notification_id } = req.query;
    try {
        // Check if id field is vaild 
        var notification = await Notification.findOne({ _id: notification_id });
        if (!notification) {
            return res.json({
                message: "Wrong notification_id or notification not found",
                code: "9992",
            });
        }
        //Decode token to get user_id
        jwt.verify(token, "secretToken", async (err, userData) => {
            if (err) {
                res.json({
                    message: "Token is invalid",
                    code: "9998",
                });
            } else {
                let user = await User.findOne({ _id: userData.user.id });
                //Search user with token provided
                if (!user) {
                    return res.json({
                        message: "Can't find user with token provided",
                        code: "9995",
                    });
                }
                //Check if token match
                if (user.token !== token) {
                    return res.json({
                        message: "Token is invalid",
                        code: "9998",
                    });
                }
                //Check if user is locked
                if (user.locked == 1) {
                    return res.json({
                        message: "User is locked",
                        code: "9995",
                    });
                }
                let count;
                try {
                    notification = await Notification.findOneAndUpdate({ _id: notification_id }, {read: true});
                    count = await Notification.countDocuments({ read: false, user_id: userData.user.id });
                } catch (error) {
                    console.log(error);
                }
                return res.json({
                    message: "OK",
                    code: "1000",
                    data: {
                        badge:count, 
                        last_update: Date.now()
                    },
                });
            }
        });
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }

})

router.post("/get_notification", async (req, res) => {
    const { token, index, count } = req.query;
    try {
        //Decode token to get user_id
        jwt.verify(token, "secretToken", async (err, userData) => {
            if (err) {
                res.json({
                    message: "Token is invalid",
                    code: "9998",
                });
            } else {
                let user = await User.findOne({ _id: userData.user.id });
                //Search user with token provided
                if (!user) {
                    return res.json({
                        message: "Can't find user with token provided",
                        code: "9995",
                    });
                }
                //Check if token match
                if (user.token !== token) {
                    return res.json({
                        message: "Token is invalid",
                        code: "9998",
                    });
                }
                //Check if user is locked
                if (user.locked == 1) {
                    return res.json({
                        message: "User is locked",
                        code: "9995",
                    });
                }
                // Create data array
                let notification =  await Notification.find({ user_id: userData.user.id });
                let count = await Notification.countDocuments({ read: false, user_id: userData.user.id });

                return res.json({
                    message: "OK",
                    code: "1000",
                    data: notification,
                    badge: count,
                    last_update: Date.now()
                });
            }
        });
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }
});

module.exports = router;
