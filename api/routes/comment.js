const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const Notification = require('../../push_notification/send')
const newCommentNotification = Notification.newCommentNotification;
const getUserDeviceToken = Notification.getUserDeviceToken;

const Comment = require("../../models/Comment");
const User = require("../../models/User");
const Post = require("../../models/Post");

router.post("/set_comment", async (req, res) => {
    const { token, id, comment, index, count } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length <= 4 || !token || !index || !count || !id || !comment) {
            return res.json({
                message: "Missing field",
                code: "1002",
            });
        }
        // Check if id field is vaild 
        var post = await Post.findOne({ _id: id });
        if (!post) {
            return res.json({
                message: "Wrong post_id or post doesn't exist",
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
                //Add new data
                let addComment = {
                    Poster: user._id,
                    Comment: comment,
                    PostID: id,
                    CreatedAt: Date.now()
                }
                try {
                    let newComment = new Comment(addComment);
                    await newComment.save();
                    post = await Post.findOneAndUpdate({ _id: id }, { $push: { Comment: newComment._id.toString() } });

                    //send push notification
                    const deviceToken = await getUserDeviceToken(post.User_id);
                    newCommentNotification(deviceToken, user.username, id, user._id)
                } catch (error) {
                    console.log(error);
                }
                // Create data array
                let commentArray = await Promise.all(
                    post.Comment.map(async (id) => {
                        let comment = await Comment.findOne({ _id: id }, { __v: 0 });
                        if (!comment) return;
                        else {
                            let user = await User.findOne({ _id: userData.user.id });
                            comment = JSON.parse(JSON.stringify(comment));
                            comment.poster = ({
                                id: userData.user.id,
                                phonenumber: user.phonenumber,
                                avatar: user.avatar,
                            })
                            return comment;
                        }
                    })
                );
                //Sort and filter null comment
                commentArray = commentArray.sort(function (a, b) {
                    return a.CreatedAt > b.CreatedAt;
                }).filter(comment => {
                    return comment !== undefined;
                });
                //Slice array by count and index
                commentArray = commentArray.slice(index, index + count);

                return res.json({
                    message: "OK",
                    code: "1000",
                    data: commentArray,
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

router.post("/get_comment", async (req, res) => {
    const { token, id, index, count } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length <= 3 || !token || !index || !count || !id) {
            return res.json({
                message: "Missing field",
                code: "1002",
            });
        }
        // Check if id field is vaild if using conversation_id
        var post = await Post.findOne({ _id: id });
        if (!post) {
            return res.json({
                message: "Wrong post_id or post doesn't exist",
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
                // Create data array
                let commentArray = await Promise.all(
                    post.Comment.map(async (id) => {
                        let comment = await Comment.findOne({ _id: id }, { __v: 0 });
                        if (!comment) return;
                        else {
                            let user = await User.findOne({ _id: userData.user.id });
                            comment = JSON.parse(JSON.stringify(comment));
                            comment.poster = ({
                                id: userData.user.id,
                                phonenumber: user.phonenumber,
                                avatar: user.avatar,
                            })
                            return comment;
                        }
                    })
                );
                //Sort and filter null comment
                commentArray = commentArray.sort(function (a, b) {
                    return a.CreatedAt > b.CreatedAt;
                }).filter(comment => {
                    return comment !== undefined;
                });
                //Slice array by count and index
                commentArray = commentArray.slice(index, index + count);

                return res.json({
                    message: "OK",
                    code: "1000",
                    data: commentArray,
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
