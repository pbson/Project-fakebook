"use strict";

var mongoose = require("mongoose");

var Conversation = require("../models/Conversation");

var Message = require("../models/Message");

var User = require("../models/User");

var botName = 'ChatCord Bot';

var request = require('request');

module.exports = function (io) {
  io.on("connection", function _callee5(socket) {
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log(socket.id); //Joinchat event

            socket.on('joinChat', function _callee(info) {
              var conversation, newConversation;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      console.log('i come in');
                      _context.next = 3;
                      return regeneratorRuntime.awrap(Conversation.findOne({
                        UserList: {
                          $all: [info.userid, info.partnerid]
                        }
                      }));

                    case 3:
                      conversation = _context.sent;

                      if (!conversation) {
                        _context.next = 8;
                        break;
                      }

                      socket.join(conversation._id);
                      _context.next = 15;
                      break;

                    case 8:
                      newConversation = new Conversation();
                      newConversation.UserList.push(info.userid);
                      newConversation.UserList.push(info.partnerid);
                      newConversation.LastMessage = Date.now();
                      _context.next = 14;
                      return regeneratorRuntime.awrap(newConversation.save());

                    case 14:
                      socket.join(newConversation._id);

                    case 15:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }); //Send event

            socket.on('send', function _callee3(data) {
              var partnerId, token, Content, isUnread;
              return regeneratorRuntime.async(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      partnerId = data.partnerId;
                      token = data.token;
                      Content = data.Content;
                      isUnread = data.isUnread;
                      request({
                        url: "https://project-facebook-clone.herokuapp.com/it4788/chatsocket/set_message?receiverId=".concat(partnerId, "&token=").concat(token, "&content=").concat(Content, "&isUnread=").concat(isUnread),
                        method: "POST",
                        json: true
                      }, function _callee2(error, response) {
                        var conversation;
                        return regeneratorRuntime.async(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                console.log(response.body.data);
                                _context2.next = 3;
                                return regeneratorRuntime.awrap(Conversation.findOne({
                                  UserList: {
                                    $all: [response.body.data.Sender, response.body.data.Receiver]
                                  }
                                }));

                              case 3:
                                conversation = _context2.sent;
                                io.to(conversation._id).emit('onmessage', response.body);

                              case 5:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        });
                      });

                    case 5:
                    case "end":
                      return _context3.stop();
                  }
                }
              });
            });
            socket.on('deleteMessgae', function _callee4(data) {
              var conversation;
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return regeneratorRuntime.awrap(Conversation.findOne({
                        UserList: {
                          $all: [data.userid, data.partnerid]
                        }
                      }));

                    case 2:
                      conversation = _context4.sent;

                      if (!conversation) {
                        _context4.next = 6;
                        break;
                      }

                      _context4.next = 6;
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
                      return _context4.stop();
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

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};