const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { post } = require(".");

router.post("/get_search", (req, res) => {
    const { token, keyword, user_id, index, count } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length <= 4 || !token || !index || !count || !keyword || !user_id) {
            return res.json({
                message: "Missing field",
                code: "1002",
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

                // Search for post that match keyword
                let post = await Post.find({
                    $text: { $search: keyword }
                })
                    .sort({ CreatedAt: 1 })
                    .skip(new Number(index))
                    .limit(new Number(count))

                //create return data array
                data = post.Status
                return res.json({
                    code: "1000",
                    message: "ok",
                    data: post.Status
                })
            }

        });
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }

})

router.post("/get_search_user", (req, res) => {
    const { token, keyword, index, count } = req.query;
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

                // Search for post that match keyword
                let findUser = await User.find({
                    $text: { $search: keyword }
                })
                    .skip(new Number(index))
                    .limit(new Number(count))

                //create return data array
                let data = []
                findUser.forEach(user => {
                    console.log(user);
                    data = [...data, {
                        username: user.username,
                        avatar: user.avatar,
                        id: user._id
                    }]
                })

                return res.json({
                    code: "1000",
                    message: "ok",
                    data: data
                })
            }

        });
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }

})

module.exports = router;
