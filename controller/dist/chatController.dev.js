"use strict";

var mongoose = require("mongoose");

var Conversation = require("../models/Conversation");

var Message = require("../models/Message");

var User = require("../models/User");

var botName = 'ChatCord Bot';

var request = require('request');

module.exports = function (io) {
  io.on("connection", function _callee8(socket) {
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            //Joinchat event
            socket.on('joinChat', function _callee(info) {
              var conversation, newConversation;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return regeneratorRuntime.awrap(Conversation.findOne({
                        UserList: {
                          $all: [info.userid, info.partnerid]
                        }
                      }));

                    case 2:
                      conversation = _context.sent;

                      if (!conversation) {
                        _context.next = 7;
                        break;
                      }

                      socket.join(conversation._id);
                      _context.next = 14;
                      break;

                    case 7:
                      newConversation = new Conversation();
                      newConversation.UserList.push(info.userid);
                      newConversation.UserList.push(info.partnerid);
                      newConversation.LastMessage = Date.now();
                      _context.next = 13;
                      return regeneratorRuntime.awrap(newConversation.save());

                    case 13:
                      socket.join(newConversation._id);

                    case 14:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
            socket.on('joinChat2', function _callee2(info) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      console.log('abc');
                      console.log(info);
                      socket.join(info.conversationId); // console.log(socket.id)
                      // let conversation = await Conversation.findOne({
                      //     UserList: { $all: [info.userid, info.partnerid] },
                      // });
                      // if (conversation) {
                      //     console.log(conversartion._id)
                      //     socket.join(conversation._id);
                      // } else {
                      //     let newConversation = new Conversation();
                      //     newConversation.UserList.push(info.userid);
                      //     newConversation.UserList.push(info.partnerid);
                      //     newConversation.LastMessage = Date.now();
                      //     await newConversation.save();
                      //     socket.join(newConversation._id);
                      // }

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            });
            socket.on('send2', function _callee4(data) {
              var partnerId, token, Content, isUnread, conversationId;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      partnerId = data.partnerId;
                      token = data.token;
                      Content = data.Content;
                      isUnread = data.isUnread;
                      conversationId = data.conversationId;
                      request({
                        url: "http://localhost:3000/it4788/chatsocket/set_message?receiverId=".concat(partnerId, "&token=").concat(token, "&content=").concat(Content, "&isUnread=").concat(isUnread, "&conversationId=").concat(conversationId),
                        method: "POST",
                        json: true
                      }, function _callee3(error, response) {
                        return regeneratorRuntime.async(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                console.log(response.body.data);
                                console.log(conversationId);
                                io.to(conversationId).emit('onmessage', response.body.data);

                              case 3:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        });
                      });

                    case 6:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            }); //Send event

            socket.on('send', function _callee6(data) {
              var partnerId, token, Content, isUnread, conversationId;
              return regeneratorRuntime.async(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      partnerId = data.partnerId;
                      token = data.token;
                      Content = data.Content;
                      isUnread = data.isUnread;
                      conversationId = data.conversationId;
                      request({
                        url: "http://localhost:3000/it4788/chatsocket/set_message?receiverId=".concat(partnerId, "&token=").concat(token, "&content=").concat(Content, "&isUnread=").concat(isUnread, "&conversationId=").concat(conversationId),
                        method: "POST",
                        json: true
                      }, function _callee5(error, response) {
                        var conversation;
                        return regeneratorRuntime.async(function _callee5$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                _context5.next = 2;
                                return regeneratorRuntime.awrap(Conversation.findOne({
                                  UserList: {
                                    $all: [response.body.data.Sender, response.body.data.Receiver]
                                  }
                                }));

                              case 2:
                                conversation = _context5.sent;
                                io.to(conversation._id).emit('onmessage', response.body);

                              case 4:
                              case "end":
                                return _context5.stop();
                            }
                          }
                        });
                      });

                    case 6:
                    case "end":
                      return _context6.stop();
                  }
                }
              });
            });
            socket.on('deleteMessgae', function _callee7(data) {
              var conversation;
              return regeneratorRuntime.async(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return regeneratorRuntime.awrap(Conversation.findOne({
                        UserList: {
                          $all: [data.userid, data.partnerid]
                        }
                      }));

                    case 2:
                      conversation = _context7.sent;

                      if (!conversation) {
                        _context7.next = 6;
                        break;
                      }

                      _context7.next = 6;
                      return regeneratorRuntime.awrap(Message.findOneAndDelete({
                        _id: data.message_id
                      }, function (err, docs) {
                        if (err) {
                          io.to(conversation._id).emit('deleteMessageError', err);
                        } else {
                          io.to(conversation._id).emit('deleteMessageSuccess', docs);
                        }
                      }));

                    case 6:
                    case "end":
                      return _context7.stop();
                  }
                }
              });
            }); //Error handling event

            socket.on('reconnect', function (attemptNumber) {
              console.log(attemptNumber);
            });
            socket.on('reconnecting', function (attemptNumber) {
              console.log(attemptNumber);
            });
            socket.on('reconnect_error', function (error) {
              console.log(error);
            });
            socket.on('reconnect_failed', function () {
              console.log("Reconnect failed");
            });
            socket.on('connect_error', function (error) {
              console.log(error);
            });
            socket.on('connect_timeout', function (timeout) {
              console.log(timeout);
            });
            socket.on('error', function (error) {
              console.log(error);
            });

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
};