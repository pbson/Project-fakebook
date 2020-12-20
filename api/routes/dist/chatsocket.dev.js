"use strict";

var express = require("express");

var router = express.Router();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mongoose = require("mongoose");

var Notification = require('../../push_notification/send');

var newCommentNotification = Notification.newMessageNotification;
var getUserDeviceToken = Notification.getUserDeviceToken;

var Conversation = require("../../models/Conversation");

var Message = require("../../models/Message");

var User = require("../../models/User");

var _require = require("../../push_notification/send"),
    newMessageNotification = _require.newMessageNotification;

router.get("/chat", function (req, res) {
  res.render("chat");
});
router.post("/set_message", function _callee2(req, res) {
  var _req$query, receiverId, token, content, isUnread, conversationId;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, receiverId = _req$query.receiverId, token = _req$query.token, content = _req$query.content, isUnread = _req$query.isUnread, conversationId = _req$query.conversationId;
          _context2.prev = 1;
          //Decode token to get user_id
          jwt.verify(token, "secretToken", function _callee(err, userData) {
            var user, newMessage;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context.next = 20;
                    break;

                  case 4:
                    _context.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context.sent;

                    if (user) {
                      _context.next = 9;
                      break;
                    }

                    return _context.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context.next = 11;
                      break;
                    }

                    return _context.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context.next = 13;
                      break;
                    }

                    return _context.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    message = {
                      Receiver: receiverId,
                      Sender: user._id,
                      Content: content,
                      Unread: isUnread,
                      IdConversation: conversationId,
                      CreatedAt: Date.now()
                    };
                    newMessage = new Message(message);
                    _context.next = 17;
                    return regeneratorRuntime.awrap(newMessage.save());

                  case 17:
                    _context.next = 19;
                    return regeneratorRuntime.awrap(Conversation.findOneAndUpdate({
                      _id: conversationId
                    }, {
                      $push: {
                        MessageList: newMessage._id.toString()
                      }
                    }));

                  case 19:
                    return _context.abrupt("return", res.json({
                      message: "OK",
                      code: "1000",
                      data: message
                    }));

                  case 20:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          _context2.next = 8;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", res.json({
            message: "Server error",
            code: "1001"
          }));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 5]]);
});
router.post("/set_conversation", function _callee4(req, res) {
  var _req$query2, token, partnerid;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query2 = req.query, token = _req$query2.token, partnerid = _req$query2.partnerid;
          _context4.prev = 1;
          jwt.verify(token, "secretToken", function _callee3(err, userData) {
            var user, conversation, newConversation;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!err) {
                      _context3.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context3.next = 27;
                    break;

                  case 4:
                    _context3.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context3.sent;

                    if (user) {
                      _context3.next = 9;
                      break;
                    }

                    return _context3.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context3.next = 11;
                      break;
                    }

                    return _context3.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context3.next = 13;
                      break;
                    }

                    return _context3.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    _context3.next = 15;
                    return regeneratorRuntime.awrap(Conversation.findOne({
                      $or: [{
                        UserList: [user.id, partnerid]
                      }, {
                        UserList: [partnerid, user.id]
                      }]
                    }));

                  case 15:
                    conversation = _context3.sent;

                    if (!conversation) {
                      _context3.next = 20;
                      break;
                    }

                    return _context3.abrupt("return", res.json({
                      message: "OK",
                      code: "1000",
                      data: conversation._id
                    }));

                  case 20:
                    newConversation = new Conversation();
                    newConversation.UserList.push(user.id);
                    newConversation.UserList.push(partnerid);
                    newConversation.LastMessage = Date.now();
                    _context3.next = 26;
                    return regeneratorRuntime.awrap(newConversation.save());

                  case 26:
                    return _context3.abrupt("return", res.json({
                      message: "OK",
                      code: "1000",
                      data: newConversation._id
                    }));

                  case 27:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 8;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](1);
          return _context4.abrupt("return", res.json({
            message: "Server error",
            code: "1001"
          }));

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 5]]);
});
router.post("/get_list_conversation", function _callee6(req, res) {
  var token, index, count;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          token = req.query.token;
          index = req.query.index;
          count = req.query.count;
          _context6.prev = 3;

          if (!token) {
            _context6.next = 8;
            break;
          }

          jwt.verify(token, "secretToken", function _callee5(err, userData) {
            var id, user, resarray, countmess, arrayConversations, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, conversation, object, userlist, idpartner, partner, messagelist, idlastmess, lastmess;

            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!err) {
                      _context5.next = 4;
                      break;
                    }

                    res.json({
                      code: "1004",
                      message: "Parameter value is invalid"
                    });
                    _context5.next = 68;
                    break;

                  case 4:
                    id = userData.user.id;
                    _context5.next = 7;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: id
                    }));

                  case 7:
                    user = _context5.sent;

                    if (!user) {
                      _context5.next = 67;
                      break;
                    }

                    if (!(token === user.token)) {
                      _context5.next = 60;
                      break;
                    }

                    if (!(user.locked == 1)) {
                      _context5.next = 12;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      code: "9995",
                      message: "You are  locked"
                    }));

                  case 12:
                    resarray = [];
                    countmess = 0;
                    _context5.next = 16;
                    return regeneratorRuntime.awrap(Conversation.find({
                      UserList: {
                        $in: [id]
                      }
                    }).sort({
                      LastMessage: -1
                    }));

                  case 16:
                    arrayConversations = _context5.sent;

                    if (index && count) {
                      arrayConversation = arrayConversations.slice(index, count);
                    } else {
                      arrayConversation = arrayConversations.slice(0, 19);
                    }

                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context5.prev = 21;
                    _iterator = arrayConversation[Symbol.iterator]();

                  case 23:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context5.next = 43;
                      break;
                    }

                    conversation = _step.value;
                    object = {};
                    object.id = conversation._id;
                    userlist = conversation.UserList;
                    console.log(userlist);
                    idpartner = userlist[0] == id ? userlist[1] : userlist[0];
                    _context5.next = 32;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: idpartner
                    }));

                  case 32:
                    partner = _context5.sent;
                    object.Partner = {
                      id: partner._id,
                      avatar: partner.avatar,
                      username: partner.username
                    };
                    messagelist = conversation.MessageList;
                    idlastmess = messagelist.pop();
                    _context5.next = 38;
                    return regeneratorRuntime.awrap(Message.findOne({
                      _id: idlastmess
                    }));

                  case 38:
                    lastmess = _context5.sent;

                    if (lastmess) {
                      object.LastMessage = {
                        message: lastmess.Content,
                        created: lastmess.CreatedAt,
                        unread: lastmess.Unread
                      };

                      if (lastmess.Unread !== false) {
                        countmess = countmess + 1;
                      }

                      resarray.push(object);
                    }

                  case 40:
                    _iteratorNormalCompletion = true;
                    _context5.next = 23;
                    break;

                  case 43:
                    _context5.next = 49;
                    break;

                  case 45:
                    _context5.prev = 45;
                    _context5.t0 = _context5["catch"](21);
                    _didIteratorError = true;
                    _iteratorError = _context5.t0;

                  case 49:
                    _context5.prev = 49;
                    _context5.prev = 50;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 52:
                    _context5.prev = 52;

                    if (!_didIteratorError) {
                      _context5.next = 55;
                      break;
                    }

                    throw _iteratorError;

                  case 55:
                    return _context5.finish(52);

                  case 56:
                    return _context5.finish(49);

                  case 57:
                    return _context5.abrupt("return", res.json({
                      code: "1000",
                      message: "OK",
                      data: resarray,
                      numberNewMessage: countmess
                    }));

                  case 60:
                    if (!(user.token === "" || user.token === null)) {
                      _context5.next = 64;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      code: "1004",
                      message: "User not logged in"
                    }));

                  case 64:
                    return _context5.abrupt("return", res.json({
                      code: "1004",
                      message: "Token is invalid"
                    }));

                  case 65:
                    _context5.next = 68;
                    break;

                  case 67:
                    return _context5.abrupt("return", res.json({
                      code: "9995",
                      message: "Don't find user by token"
                    }));

                  case 68:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, null, [[21, 45, 49, 57], [50,, 52, 56]]);
          });
          _context6.next = 9;
          break;

        case 8:
          return _context6.abrupt("return", res.json({
            code: "1002",
            message: "No have Token"
          }));

        case 9:
          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](3);
          return _context6.abrupt("return", res.json({
            code: "1005",
            message: _context6.t0
          }));

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router.post("/get_conversation", function _callee9(req, res) {
  var _req$query3, token, partner_id, conversation_id, index, count, partner, conversation;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$query3 = req.query, token = _req$query3.token, partner_id = _req$query3.partner_id, conversation_id = _req$query3.conversation_id, index = _req$query3.index, count = _req$query3.count;
          _context9.prev = 1;

          if (!(Object.keys(req.query).length <= 3 || !token || !index || !count)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 4:
          if (!partner_id) {
            _context9.next = 10;
            break;
          }

          _context9.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            _id: partner_id
          }));

        case 7:
          partner = _context9.sent;

          if (partner) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", res.json({
            message: "Wrong partner_id",
            code: "9995"
          }));

        case 10:
          if (!conversation_id) {
            _context9.next = 16;
            break;
          }

          _context9.next = 13;
          return regeneratorRuntime.awrap(Conversation.findOne({
            _id: conversation_id
          }));

        case 13:
          conversation = _context9.sent;

          if (conversation) {
            _context9.next = 16;
            break;
          }

          return _context9.abrupt("return", res.json({
            message: "Wrong conversation_id",
            code: "9995"
          }));

        case 16:
          //Decode token to get user_id
          jwt.verify(token, "secretToken", function _callee8(err, userData) {
            var user, messageArray;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    if (!err) {
                      _context8.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context8.next = 23;
                    break;

                  case 4:
                    _context8.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context8.sent;

                    if (user) {
                      _context8.next = 9;
                      break;
                    }

                    return _context8.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context8.next = 11;
                      break;
                    }

                    return _context8.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context8.next = 13;
                      break;
                    }

                    return _context8.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    if (!(partner_id && !conversation_id)) {
                      _context8.next = 17;
                      break;
                    }

                    _context8.next = 16;
                    return regeneratorRuntime.awrap(Conversation.findOne({
                      UserList: {
                        $all: [user.id, partner_id]
                      }
                    }));

                  case 16:
                    conversation = _context8.sent;

                  case 17:
                    _context8.next = 19;
                    return regeneratorRuntime.awrap(Promise.all(conversation.MessageList.map(function _callee7(message_id) {
                      var message, _user;

                      return regeneratorRuntime.async(function _callee7$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              _context7.next = 2;
                              return regeneratorRuntime.awrap(Message.findOne({
                                _id: message_id
                              }, {
                                __v: 0,
                                IdConversation: 0
                              }));

                            case 2:
                              message = _context7.sent;

                              if (message) {
                                _context7.next = 7;
                                break;
                              }

                              return _context7.abrupt("return");

                            case 7:
                              _context7.next = 9;
                              return regeneratorRuntime.awrap(User.findOne({
                                _id: userData.user.id
                              }));

                            case 9:
                              _user = _context7.sent;
                              message = JSON.parse(JSON.stringify(message));
                              message.avatar = _user.avatar;
                              message.phonenumber = _user.phonenumber;
                              return _context7.abrupt("return", message);

                            case 14:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      });
                    })));

                  case 19:
                    messageArray = _context8.sent;
                    //Sort and filter null message
                    messageArray = messageArray.sort(function (a, b) {
                      return a.CreatedAt > b.CreatedAt;
                    }).filter(function (message) {
                      return message !== undefined;
                    }); //Slice array by count and index

                    messageArray = messageArray.slice(index, index + count);
                    return _context8.abrupt("return", res.json({
                      message: "OK",
                      code: "1000",
                      data: messageArray
                    }));

                  case 23:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          });
          _context9.next = 22;
          break;

        case 19:
          _context9.prev = 19;
          _context9.t0 = _context9["catch"](1);
          return _context9.abrupt("return", res.json({
            message: "Server error",
            code: "1001"
          }));

        case 22:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 19]]);
});
router.post("/a", function _callee10(req, res) {
  var a;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(Message.find({}));

        case 2:
          a = _context10.sent;
          return _context10.abrupt("return", res.json(a));

        case 4:
        case "end":
          return _context10.stop();
      }
    }
  });
});
router.post("/b", function _callee11(req, res) {
  var id, a;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          id = req.query.id;
          _context11.next = 3;
          return regeneratorRuntime.awrap(Conversation.findOneAndUpdate({
            _id: id
          }, {
            LastMessage: Date.now()
          }));

        case 3:
          a = _context11.sent;
          return _context11.abrupt("return", res.json(a));

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
});
router.post("/set_read_message", function (req, res) {
  var token = req.query.token;
  var partner_id = req.query.partner_id;
  var conversation_id = req.query.conversation_id;

  try {
    if (token && partner_id || token && conversation_id) {
      jwt.verify(token, "secretToken", function _callee12(err, userData) {
        var id, user, conversation, _conversation;

        return regeneratorRuntime.async(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (!err) {
                  _context12.next = 4;
                  break;
                }

                res.json({
                  code: "9998",
                  message: "Token is invalid"
                });
                _context12.next = 46;
                break;

              case 4:
                id = userData.user.id;
                _context12.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context12.sent;

                if (!user) {
                  _context12.next = 45;
                  break;
                }

                if (!(token === user.token)) {
                  _context12.next = 38;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context12.next = 14;
                  break;
                }

                return _context12.abrupt("return", res.json({
                  code: "9995",
                  message: "You are  locked"
                }));

              case 14:
                if (!conversation_id) {
                  _context12.next = 26;
                  break;
                }

                _context12.next = 17;
                return regeneratorRuntime.awrap(Conversation.findOne({
                  _id: conversation_id
                }));

              case 17:
                conversation = _context12.sent;

                if (!conversation) {
                  _context12.next = 23;
                  break;
                }

                _context12.next = 21;
                return regeneratorRuntime.awrap(Message.updateMany({
                  Receiver: id
                }, {
                  Unread: false
                }, function (err, doc) {
                  if (err) {
                    return res.json({
                      code: "1005",
                      message: err
                    });
                  } else {
                    return res.json({
                      code: "1000",
                      message: "OK"
                    });
                  }
                }));

              case 21:
                _context12.next = 24;
                break;

              case 23:
                return _context12.abrupt("return", res.json({
                  code: "1004",
                  message: "Conversation Not Found"
                }));

              case 24:
                _context12.next = 36;
                break;

              case 26:
                if (!partner_id) {
                  _context12.next = 36;
                  break;
                }

                _context12.next = 29;
                return regeneratorRuntime.awrap(Conversation.findOne({
                  UserList: {
                    $all: [id, partner_id]
                  }
                }));

              case 29:
                _conversation = _context12.sent;

                if (!_conversation) {
                  _context12.next = 35;
                  break;
                }

                _context12.next = 33;
                return regeneratorRuntime.awrap(Message.updateMany({
                  Receiver: id
                }, {
                  Unread: false
                }, function (err, doc) {
                  if (err) {
                    return res.json({
                      code: "1005",
                      message: err
                    });
                  } else {
                    return res.json({
                      code: "1000",
                      message: "OK"
                    });
                  }
                }));

              case 33:
                _context12.next = 36;
                break;

              case 35:
                return _context12.abrupt("return", res.json({
                  code: "1004",
                  message: "Conversation Not Found"
                }));

              case 36:
                _context12.next = 43;
                break;

              case 38:
                if (!(user.Token === "" || user.Token === null)) {
                  _context12.next = 42;
                  break;
                }

                return _context12.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 42:
                return _context12.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 43:
                _context12.next = 46;
                break;

              case 45:
                return _context12.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 46:
              case "end":
                return _context12.stop();
            }
          }
        });
      });
    } else {
      return res.json({
        code: "1002",
        message: "Missing token or partner_id or conversation_id "
      });
    }
  } catch (error) {
    return res.json({
      code: "1005",
      message: error
    });
  }
});
router.post("/delete_message", function _callee14(req, res) {
  var _req$query4, token, message_id, _req$query5, partner_id, conversation_id, partner, conversation, message;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _req$query4 = req.query, token = _req$query4.token, message_id = _req$query4.message_id;
          _req$query5 = req.query, partner_id = _req$query5.partner_id, conversation_id = _req$query5.conversation_id;
          _context14.prev = 2;

          if (!(Object.keys(req.query).length <= 2 || !token || !message_id)) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 5:
          if (!partner_id) {
            _context14.next = 11;
            break;
          }

          _context14.next = 8;
          return regeneratorRuntime.awrap(User.findOne({
            _id: partner_id
          }));

        case 8:
          partner = _context14.sent;

          if (partner) {
            _context14.next = 11;
            break;
          }

          return _context14.abrupt("return", res.json({
            message: "Partner_id is invalid or doesn't exist",
            code: "9995"
          }));

        case 11:
          if (!conversation_id) {
            _context14.next = 17;
            break;
          }

          _context14.next = 14;
          return regeneratorRuntime.awrap(Conversation.findOne({
            _id: conversation_id
          }));

        case 14:
          conversation = _context14.sent;

          if (conversation) {
            _context14.next = 17;
            break;
          }

          return _context14.abrupt("return", res.json({
            message: "Conversation_id is invalid or doesn't exist",
            code: "9995"
          }));

        case 17:
          _context14.next = 19;
          return regeneratorRuntime.awrap(Message.findOne({
            _id: message_id
          }));

        case 19:
          message = _context14.sent;

          if (message) {
            _context14.next = 22;
            break;
          }

          return _context14.abrupt("return", res.json({
            message: "Message_id is invalid or doesn't exist",
            code: "9995"
          }));

        case 22:
          //Decode token to get user_id
          jwt.verify(token, "secretToken", function _callee13(err, userData) {
            var user;
            return regeneratorRuntime.async(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    if (!err) {
                      _context13.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context13.next = 25;
                    break;

                  case 4:
                    _context13.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context13.sent;

                    if (user) {
                      _context13.next = 9;
                      break;
                    }

                    return _context13.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context13.next = 11;
                      break;
                    }

                    return _context13.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context13.next = 13;
                      break;
                    }

                    return _context13.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    if (!(partner_id && !conversation_id)) {
                      _context13.next = 18;
                      break;
                    }

                    _context13.next = 16;
                    return regeneratorRuntime.awrap(Conversation.findOne({
                      UserList: {
                        $all: [user.id, partner_id]
                      }
                    }));

                  case 16:
                    conversation = _context13.sent;
                    conversation_id = conversation.id;

                  case 18:
                    if (conversation.MessageList.includes(message_id)) {
                      _context13.next = 20;
                      break;
                    }

                    return _context13.abrupt("return", res.json({
                      message: "Message doesn't exist with provided conversation_id",
                      code: "9994"
                    }));

                  case 20:
                    _context13.next = 22;
                    return regeneratorRuntime.awrap(Message.findByIdAndDelete(message_id));

                  case 22:
                    _context13.next = 24;
                    return regeneratorRuntime.awrap(Conversation.updateOne({
                      _id: conversation_id
                    }, {
                      $pullAll: {
                        MessageList: [message_id]
                      }
                    }));

                  case 24:
                    return _context13.abrupt("return", res.json({
                      message: "OK",
                      code: "1000"
                    }));

                  case 25:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          });
          _context14.next = 28;
          break;

        case 25:
          _context14.prev = 25;
          _context14.t0 = _context14["catch"](2);
          return _context14.abrupt("return", res.json({
            message: "Server error",
            code: "1001"
          }));

        case 28:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[2, 25]]);
});
router.post("/delete_conversation", function (req, res) {
  var token = req.query.token;
  var partner_id = req.query.partner_id;
  var conversation_id = req.query.conversation_id;

  try {
    if (token && partner_id || token && conversation_id) {
      jwt.verify(token, "secretToken", function _callee17(err, userData) {
        var id, user, conversation, messagelist, _conversation2, _messagelist;

        return regeneratorRuntime.async(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (!err) {
                  _context17.next = 4;
                  break;
                }

                res.json({
                  code: "9998",
                  message: "Token is invalid"
                });
                _context17.next = 52;
                break;

              case 4:
                id = userData.user.id;
                _context17.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context17.sent;

                if (!user) {
                  _context17.next = 51;
                  break;
                }

                if (!(token === user.token)) {
                  _context17.next = 44;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context17.next = 14;
                  break;
                }

                return _context17.abrupt("return", res.json({
                  code: "9995",
                  message: "You are  locked"
                }));

              case 14:
                if (!conversation_id) {
                  _context17.next = 29;
                  break;
                }

                _context17.next = 17;
                return regeneratorRuntime.awrap(Conversation.findOne({
                  _id: conversation_id
                }));

              case 17:
                conversation = _context17.sent;

                if (!conversation) {
                  _context17.next = 26;
                  break;
                }

                messagelist = conversation.MessageList;
                messagelist.forEach(function _callee15(message) {
                  return regeneratorRuntime.async(function _callee15$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          _context15.next = 2;
                          return regeneratorRuntime.awrap(Message.findOneAndDelete({
                            _id: message
                          }));

                        case 2:
                        case "end":
                          return _context15.stop();
                      }
                    }
                  });
                });
                _context17.next = 23;
                return regeneratorRuntime.awrap(Conversation.findOneAndDelete({
                  _id: conversation._id
                }));

              case 23:
                return _context17.abrupt("return", res.json({
                  code: "1000",
                  message: "OK"
                }));

              case 26:
                return _context17.abrupt("return", res.json({
                  code: "1004",
                  message: "Conversation Not Found"
                }));

              case 27:
                _context17.next = 42;
                break;

              case 29:
                if (!partner_id) {
                  _context17.next = 42;
                  break;
                }

                _context17.next = 32;
                return regeneratorRuntime.awrap(Conversation.findOne({
                  UserList: {
                    $all: [id, partner_id]
                  }
                }));

              case 32:
                _conversation2 = _context17.sent;

                if (!_conversation2) {
                  _context17.next = 41;
                  break;
                }

                _messagelist = _conversation2.MessageList;

                _messagelist.forEach(function _callee16(message) {
                  return regeneratorRuntime.async(function _callee16$(_context16) {
                    while (1) {
                      switch (_context16.prev = _context16.next) {
                        case 0:
                          _context16.next = 2;
                          return regeneratorRuntime.awrap(Message.findOneAndDelete({
                            _id: message
                          }));

                        case 2:
                        case "end":
                          return _context16.stop();
                      }
                    }
                  });
                });

                _context17.next = 38;
                return regeneratorRuntime.awrap(Conversation.findOneAndDelete({
                  _id: _conversation2._id
                }));

              case 38:
                return _context17.abrupt("return", res.json({
                  code: "1000",
                  message: "OK"
                }));

              case 41:
                return _context17.abrupt("return", res.json({
                  code: "1004",
                  message: "Conversation Not Found"
                }));

              case 42:
                _context17.next = 49;
                break;

              case 44:
                if (!(user.Token === "" || user.Token === null)) {
                  _context17.next = 48;
                  break;
                }

                return _context17.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 48:
                return _context17.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 49:
                _context17.next = 52;
                break;

              case 51:
                return _context17.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 52:
              case "end":
                return _context17.stop();
            }
          }
        });
      });
    } else {
      return res.json({
        code: "1002",
        message: "Missing token or partner_id or conversation_id "
      });
    }
  } catch (error) {
    return res.json({
      code: "1005",
      message: error
    });
  }
});
module.exports = router;