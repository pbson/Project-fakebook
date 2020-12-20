const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const Notification = require('../../push_notification/send')
const newCommentNotification = Notification.newMessageNotification;
const getUserDeviceToken = Notification.getUserDeviceToken;

const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const User = require("../../models/User");
const { newMessageNotification } = require("../../push_notification/send");

router.get("/chat", (req, res) => {
    res.render("chat");
})

router.post("/set_message", async (req, res) => {
    const { receiverId, token, content, isUnread, conversationId } = req.query;

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

                message = {
                    Receiver: receiverId,
                    Sender: user._id,
                    Content: content,
                    Unread: isUnread,
                    IdConversation: conversationId,
                    CreatedAt: Date.now()
                }

                let newMessage = new Message(message);
                await newMessage.save();
                await Conversation.findOneAndUpdate({ _id: conversationId }, { $push: { MessageList: newMessage._id.toString() } });
                return res.json({
                    message: "OK",
                    code: "1000",
                    data: message,
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

router.post("/set_conversation", async (req, res) => {
    const { token, partnerid } = req.query;
    try {
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
                let conversation = await Conversation.findOne({
                    $or:[ 
                        {UserList:[user.id, partnerid]}, {UserList:[partnerid, user.id]} 
                    ]
                });
                if (conversation) {
                    return res.json({
                        message: "OK",
                        code: "1000",
                        data: conversation._id,
                    });
                } else {
                    let newConversation = new Conversation();
                    newConversation.UserList.push(user.id);
                    newConversation.UserList.push(partnerid);
                    newConversation.LastMessage = Date.now();
                    await newConversation.save();

                    return res.json({
                        message: "OK",
                        code: "1000",
                        data: newConversation._id,
                    })
                }
            }
        })
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }
})
router.post("/get_list_conversation", async (req, res) => {
    const token = req.query.token;
    const index = req.query.index;
    const count = req.query.count;

    try {
        if (token) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004",
                        message: "Parameter value is invalid",
                    });
                } else {
                    const id = userData.user.id;
                    let user = await User.findOne({ _id: id });
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked",
                                });
                            }
                            let resarray = [];
                            let countmess = 0;
                            let arrayConversations = await Conversation.find({
                                UserList: { $in: [id] }
                            }).sort({ LastMessage: -1 });
                            if (index && count) {
                                arrayConversation = arrayConversations.slice(index, count);
                            } else {
                                arrayConversation = arrayConversations.slice(0, 19);
                            }
                            for (const conversation of arrayConversation) {
                                let object = {};
                                object.id = conversation._id;
                                const userlist = conversation.UserList;
                                console.log(userlist);
                                let idpartner = userlist[0] == id ? userlist[1] : userlist[0];
                                let partner = await User.findOne({ _id: idpartner });
                                object.Partner = {
                                    id: partner._id,
                                    avatar: partner.avatar,
                                    username: partner.username
                                };
                                const messagelist = conversation.MessageList;
                                const idlastmess = messagelist.pop();
                                let lastmess = await Message.findOne({ _id: idlastmess });
                                if (lastmess){
                                    object.LastMessage = {
                                        message: lastmess.Content,
                                        created: lastmess.CreatedAt,
                                        unread: lastmess.Unread,
                                    };
                                    if (lastmess.Unread !== false) {
                                        countmess = countmess + 1;
                                    }
                                    resarray.push(object);
                                }
                            }
                            return res.json({
                                code: "1000",
                                message: "OK",
                                data: resarray,
                                numberNewMessage: countmess,
                            });
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User not logged in",
                                });
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid",
                                });
                            }
                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token",
                        });
                    }
                }
            });
        } else {
            return res.json({
                code: "1002",
                message: "No have Token",
            });
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error,
        });
    }
});

router.post("/get_conversation", async (req, res) => {
    const { token, partner_id, conversation_id, index, count } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length <= 3 || !token || !index || !count) {
            return res.json({
                message: "Missing field",
                code: "1002",
            });
        }
        if (partner_id) {
            // Check if partner_id field is vaild if using partner_id
            let partner = await User.findOne({ _id: partner_id });

            if (!partner) {
                return res.json({
                    message: "Wrong partner_id",
                    code: "9995",
                });
            }
        }
        // Check if conversation_id field is vaild if using conversation_id
        if (conversation_id) {
            var conversation = await Conversation.findOne({ _id: conversation_id });
            if (!conversation) {
                return res.json({
                    message: "Wrong conversation_id",
                    code: "9995",
                });
            }
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
                //Get conversation_id if partner_id is passed
                if (partner_id && !conversation_id) {
                    conversation = await Conversation.findOne({
                        UserList: { $all: [user.id, partner_id] },
                    });
                }
                // Create data array
                let messageArray = await Promise.all(
                    conversation.MessageList.map(async (message_id) => {
                        let message = await Message.findOne({ _id: message_id }, { __v: 0, IdConversation: 0 });
                        if (!message) return;
                        else {
                            let user = await User.findOne({ _id: userData.user.id });
                            message = JSON.parse(JSON.stringify(message));
                            message.avatar = user.avatar;
                            message.phonenumber = user.phonenumber;
                            return message;
                        }
                    })
                );
                //Sort and filter null message
                messageArray = messageArray.sort(function (a, b) {
                    return a.CreatedAt > b.CreatedAt;
                }).filter(message => {
                    return message !== undefined;
                });
                //Slice array by count and index
                messageArray = messageArray.slice(index, index + count);

                return res.json({
                    message: "OK",
                    code: "1000",
                    data: messageArray,
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

router.post("/a", async (req, res) => {
    let a = await Message.find({});
    return res.json(a);
});
router.post("/b", async (req, res) => {
    const id = req.query.id;
    let a = await Conversation.findOneAndUpdate({ _id: id }, { LastMessage: Date.now() });
    return res.json(a);
});
router.post("/set_read_message", (req, res) => {
    const token = req.query.token;
    const partner_id = req.query.partner_id;
    const conversation_id = req.query.conversation_id;
    try {
        if ((token && partner_id) || (token && conversation_id)) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "9998",
                        message: "Token is invalid",
                    });
                } else {
                    const id = userData.user.id;
                    let user = await User.findOne({ _id: id });
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked",
                                });
                            } else {
                                if (conversation_id) {
                                    let conversation = await Conversation.findOne({
                                        _id: conversation_id,
                                    });
                                    if (conversation) {
                                        await Message.updateMany({ Receiver: id }, { Unread: false }, (err, doc) => {
                                            if (err) {
                                                return res.json({
                                                    code: "1005",
                                                    message: err
                                                })
                                            } else {
                                                return res.json({
                                                    code: "1000",
                                                    message: "OK",
                                                });
                                            }
                                        })

                                    } else {
                                        return res.json({
                                            code: "1004",
                                            message: "Conversation Not Found",
                                        });
                                    }
                                } else if (partner_id) {
                                    let conversation = await Conversation.findOne({
                                        UserList: { $all: [id, partner_id] }
                                    });
                                    if (conversation) {
                                        await Message.updateMany({ Receiver: id }, { Unread: false }, (err, doc) => {
                                            if (err) {
                                                return res.json({
                                                    code: "1005",
                                                    message: err
                                                })
                                            } else {
                                                return res.json({
                                                    code: "1000",
                                                    message: "OK",
                                                });
                                            }
                                        })
                                    } else {
                                        return res.json({
                                            code: "1004",
                                            message: "Conversation Not Found",
                                        });
                                    }
                                }
                            }
                        } else {
                            if (user.Token === "" || user.Token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db",
                                });
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid",
                                });
                            }
                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token",
                        });
                    }
                }
            });
        } else {
            return res.json({
                code: "1002",
                message: "Missing token or partner_id or conversation_id ",
            });
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error,
        });
    }
});
router.post("/delete_message", async (req, res) => {
    const { token, message_id } = req.query;
    let { partner_id, conversation_id } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length <= 2 || !token || !message_id) {
            return res.json({
                message: "Missing field",
                code: "1002",
            });
        }
        if (partner_id) {
            // Check if partner_id field is vaild if using partner_id
            let partner = await User.findOne({ _id: partner_id });

            if (!partner) {
                return res.json({
                    message: "Partner_id is invalid or doesn't exist",
                    code: "9995",
                });
            }
        }
        // Check if conversation_id field is vaild if using conversation_id
        if (conversation_id) {
            var conversation = await Conversation.findOne({ _id: conversation_id });
            if (!conversation) {
                return res.json({
                    message: "Conversation_id is invalid or doesn't exist",
                    code: "9995",
                });
            }
        }
        // Check if message_id exist
        var message = await Message.findOne({ _id: message_id });
        if (!message) {
            return res.json({
                message: "Message_id is invalid or doesn't exist",
                code: "9995",
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
                //Get conversation_id if partner_id is passed
                if (partner_id && !conversation_id) {
                    conversation = await Conversation.findOne({
                        UserList: { $all: [user.id, partner_id] },
                    });
                    conversation_id = conversation.id;
                }
                //Check if message_id and conversation_id is linked
                if (!conversation.MessageList.includes(message_id)) {
                    return res.json({
                        message: "Message doesn't exist with provided conversation_id",
                        code: "9994",
                    });
                }
                // Delete message
                await Message.findByIdAndDelete(message_id);
                //Delete from list of conversation
                await Conversation.updateOne({ _id: conversation_id }, { $pullAll: { MessageList: [message_id] } })
                return res.json({
                    message: "OK",
                    code: "1000"
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

router.post("/delete_conversation", (req, res) => {
    const token = req.query.token;
    const partner_id = req.query.partner_id;
    const conversation_id = req.query.conversation_id;
    try {
        if ((token && partner_id) || (token && conversation_id)) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "9998",
                        message: "Token is invalid",
                    });
                } else {
                    const id = userData.user.id;
                    let user = await User.findOne({ _id: id });
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked",
                                });
                            } else {
                                if (conversation_id) {
                                    let conversation = await Conversation.findOne({
                                        _id: conversation_id,
                                    });
                                    if (conversation) {
                                        let messagelist = conversation.MessageList;
                                        messagelist.forEach(async (message) => {
                                            await Message.findOneAndDelete({ _id: message });
                                        });
                                        await Conversation.findOneAndDelete({
                                            _id: conversation._id,
                                        });
                                        return res.json({
                                            code: "1000",
                                            message: "OK",
                                        });
                                    } else {
                                        return res.json({
                                            code: "1004",
                                            message: "Conversation Not Found",
                                        });
                                    }
                                } else if (partner_id) {
                                    let conversation = await Conversation.findOne({
                                        UserList: { $all: [id, partner_id] }
                                    });
                                    if (conversation) {
                                        let messagelist = conversation.MessageList;
                                        messagelist.forEach(async (message) => {
                                            await Message.findOneAndDelete({ _id: message });
                                        });
                                        await Conversation.findOneAndDelete({
                                            _id: conversation._id,
                                        });
                                        return res.json({
                                            code: "1000",
                                            message: "OK",
                                        });
                                    } else {
                                        return res.json({
                                            code: "1004",
                                            message: "Conversation Not Found",
                                        });
                                    }
                                }
                            }
                        } else {
                            if (user.Token === "" || user.Token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db",
                                });
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid",
                                });
                            }
                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token",
                        });
                    }
                }
            });
        } else {
            return res.json({
                code: "1002",
                message: "Missing token or partner_id or conversation_id ",
            });
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error,
        });
    }
});

module.exports = router;