"use strict";

var express = require("express");

var router = express.Router();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var mongoose = require('mongoose');

var User = require("../../models/User");

var DeviceToken = require("../../models/DeviceToken");

router.post("/signup", function _callee2(req, res) {
  var _req$query, phonenumber, password, uuid, vnf_regex, findUser, salt, saltPassword, user, payload;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, phonenumber = _req$query.phonenumber, password = _req$query.password, uuid = _req$query.uuid;
          vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
          _context2.prev = 2;

          if (!(Object.keys(req.query).length !== 3 || uuid.length <= 0 || password.length <= 0 || phonenumber.length <= 0)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 7:
          if (vnf_regex.test(phonenumber)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Invalid phone number",
            code: "1003"
          }));

        case 11:
          if (!(password.length < 6 || password.length > 10 || password.trim() === phonenumber.trim())) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Invalid password",
            code: "1003"
          }));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(User.find({
            phonenumber: phonenumber
          }));

        case 15:
          findUser = _context2.sent;

          if (!(findUser.length > 0)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "User existed",
            code: "9996"
          }));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 20:
          salt = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 23:
          saltPassword = _context2.sent;
          user = new User({
            phonenumber: phonenumber,
            password: saltPassword,
            uuid: uuid,
            latestLoginTime: Date.now(),
            locked: "0",
            avatar: req.headers.host + '/it4788/uploads/image/19b64ad6ca7b090e6ab9a88bf5da42fb.png'
          });
          _context2.next = 27;
          return regeneratorRuntime.awrap(user.save());

        case 27:
          // Create a new user
          payload = {
            user: {
              id: user.id,
              password: user.password,
              latestLoginTime: user.latestLoginTime
            }
          };
          jwt.sign(payload, "secretToken", {
            expiresIn: 360000
          }, function _callee(err, token) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 2;
                      break;
                    }

                    throw err;

                  case 2:
                    _context.next = 4;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: user.id
                    }, {
                      token: token
                    }));

                  case 4:
                    return _context.abrupt("return", res.json({
                      message: " User created",
                      code: 1000,
                      token: token
                    }));

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          _context2.next = 34;
          break;

        case 31:
          _context2.prev = 31;
          _context2.t0 = _context2["catch"](2);
          res.send("Server error");

        case 34:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 31]]);
});
router.post("/login", function _callee4(req, res) {
  var _req$query2, phonenumber, password, uuid, vnf_regex, user, isMatch, payload;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query2 = req.query, phonenumber = _req$query2.phonenumber, password = _req$query2.password, uuid = _req$query2.uuid;
          vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
          _context4.prev = 2;

          if (!(Object.keys(req.query).length !== 3 || uuid.length <= 0 || password.length <= 0 || phonenumber.length <= 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 7:
          if (vnf_regex.test(phonenumber)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: "Invalid phone number",
            code: "1003"
          }));

        case 11:
          if (!(password.length < 6 || password.length > 10 || password.trim() === phonenumber.trim())) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: "Invalid password",
            code: "1003"
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(User.findOne({
            phonenumber: phonenumber
          }));

        case 15:
          user = _context4.sent;

          if (user) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: "Invalid credential",
            code: "1003"
          }));

        case 18:
          _context4.next = 20;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 20:
          isMatch = _context4.sent;

          if (isMatch) {
            _context4.next = 23;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: "Invalid credential",
            code: "1003"
          }));

        case 23:
          // Sign a token
          payload = {
            user: {
              id: user.id,
              password: user.password,
              latestLoginTime: user.latestLoginTime
            }
          };
          jwt.sign(payload, "secretToken", {
            expiresIn: 360000
          }, function _callee3(err, token) {
            var findUser;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!err) {
                      _context3.next = 2;
                      break;
                    }

                    throw err;

                  case 2:
                    _context3.next = 4;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: user.id
                    }, {
                      token: token,
                      latestLoginTime: Date.now()
                    }));

                  case 4:
                    findUser = _context3.sent;

                    if (findUser) {
                      _context3.next = 9;
                      break;
                    }

                    return _context3.abrupt("return", res.json({
                      message: "Invalid credential",
                      code: "9996"
                    }));

                  case 9:
                    return _context3.abrupt("return", res.json({
                      message: "User logged in",
                      code: "1000",
                      data: {
                        id: user.id,
                        phonenumber: user.phonenumber,
                        token: token,
                        avatar: user.avatar
                      }
                    }));

                  case 10:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 30;
          break;

        case 27:
          _context4.prev = 27;
          _context4.t0 = _context4["catch"](2);
          res.send("Server error");

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 27]]);
});
router.post("/set_accept_friend", function _callee6(req, res) {
  var _req$query3, token, user_id, is_accept, requestFriend;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$query3 = req.query, token = _req$query3.token, user_id = _req$query3.user_id, is_accept = _req$query3.is_accept;
          _context6.prev = 1;

          if (!(Object.keys(req.query).length !== 3 || token.length <= 0 || user_id.length <= 0 || is_accept.length <= 0)) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 6:
          if (["0", "1"].includes(is_accept)) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.json({
            message: "Invalid is_accept field",
            code: "1003"
          }));

        case 8:
          _context6.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            _id: user_id
          }));

        case 10:
          requestFriend = _context6.sent;

          if (!(!requestFriend || requestFriend.locked == 1)) {
            _context6.next = 13;
            break;
          }

          return _context6.abrupt("return", res.json({
            message: "Request friend doesn't exist or locked",
            code: "9995"
          }));

        case 13:
          //Decode token to get id
          jwt.verify(token, "secretToken", function _callee5(err, userData) {
            var user;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!err) {
                      _context5.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context5.next = 33;
                    break;

                  case 4:
                    _context5.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context5.sent;

                    if (user) {
                      _context5.next = 9;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context5.next = 11;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context5.next = 13;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    if (user.FriendsRequest.includes(user_id)) {
                      _context5.next = 15;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "Friend request is invalid",
                      code: "9994"
                    }));

                  case 15:
                    if (requestFriend.Req.includes(user.id)) {
                      _context5.next = 19;
                      break;
                    }

                    return _context5.abrupt("return", res.json({
                      message: "Friend request is invalid",
                      code: "9994"
                    }));

                  case 19:
                    if (!(is_accept == 1)) {
                      _context5.next = 27;
                      break;
                    }

                    _context5.next = 22;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: user.id
                    }, {
                      $pull: {
                        FriendsRequest: mongoose.Types.ObjectId(user_id)
                      },
                      $push: {
                        ListFriends: mongoose.Types.ObjectId(user_id)
                      }
                    }));

                  case 22:
                    _context5.next = 24;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: requestFriend.id
                    }, {
                      $pull: {
                        Req: mongoose.Types.ObjectId(user.id)
                      },
                      $push: {
                        ListFriends: mongoose.Types.ObjectId(user.id)
                      }
                    }));

                  case 24:
                    return _context5.abrupt("return", res.json({
                      message: "Friend request accepted",
                      code: "1000"
                    }));

                  case 27:
                    if (!(is_accept == 0)) {
                      _context5.next = 33;
                      break;
                    }

                    _context5.next = 30;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: user.id
                    }, {
                      $pull: {
                        FriendsRequest: mongoose.Types.ObjectId(user_id)
                      }
                    }));

                  case 30:
                    _context5.next = 32;
                    return regeneratorRuntime.awrap(User.findOneAndUpdate({
                      _id: requestFriend.id
                    }, {
                      $pull: {
                        Req: mongoose.Types.ObjectId(user.id)
                      }
                    }));

                  case 32:
                    return _context5.abrupt("return", res.json({
                      message: "Friend request denined",
                      code: "1000"
                    }));

                  case 33:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });
          _context6.next = 19;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](1);
          return _context6.abrupt("return", res.json({
            message: 'Server error',
            code: "1001"
          }));

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 16]]);
}); //Quang 
// logout 

router.post("/logout/", function (req, res) {
  var token = req.query.token;

  try {
    if (token) {
      jwt.verify(token, "secretToken", function _callee7(err, userData) {
        var id, user, a;
        return regeneratorRuntime.async(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!err) {
                  _context7.next = 4;
                  break;
                }

                res.json({
                  code: "1004",
                  message: "Parameter value is invalid"
                });
                _context7.next = 28;
                break;

              case 4:
                id = userData.user.id;
                _context7.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context7.sent;

                if (!user) {
                  _context7.next = 27;
                  break;
                }

                if (!(token === user.token)) {
                  _context7.next = 20;
                  break;
                }

                _context7.next = 12;
                return regeneratorRuntime.awrap(User.findOneAndUpdate({
                  _id: user._id
                }, {
                  token: ""
                }));

              case 12:
                a = _context7.sent;

                if (!a) {
                  _context7.next = 17;
                  break;
                }

                return _context7.abrupt("return", res.json({
                  code: "1000",
                  message: "OK"
                }));

              case 17:
                return _context7.abrupt("return", res.json({
                  code: "1001",
                  message: "Can not connect Database"
                }));

              case 18:
                _context7.next = 25;
                break;

              case 20:
                if (!(user.token === "" || user.token === null)) {
                  _context7.next = 24;
                  break;
                }

                return _context7.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 24:
                return _context7.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 25:
                _context7.next = 28;
                break;

              case 27:
                return _context7.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 28:
              case "end":
                return _context7.stop();
            }
          }
        });
      });
    } else {
      return res.json({
        code: "1002",
        message: "No have Token"
      });
    }
  } catch (error) {
    return res.json({
      code: "1005",
      message: error
    });
  }
}); // set request friend 

router.post("/set_request_friend/", function (req, res) {
  var _req$query4 = req.query,
      token = _req$query4.token,
      user_id = _req$query4.user_id;

  try {
    if (token && user_id) {
      jwt.verify(token, "secretToken", function _callee8(err, userData) {
        var id, user, a, l1, l2, count, i, j, ar1, ar2, c1, c2, _i, _j;

        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!err) {
                  _context8.next = 4;
                  break;
                }

                res.json({
                  code: "9998",
                  message: "Token is invalid"
                });
                _context8.next = 82;
                break;

              case 4:
                id = userData.user.id;
                _context8.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context8.sent;

                if (!user) {
                  _context8.next = 81;
                  break;
                }

                if (!(token === user.token)) {
                  _context8.next = 74;
                  break;
                }

                _context8.next = 12;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: user_id
                }));

              case 12:
                a = _context8.sent;

                if (!a) {
                  _context8.next = 71;
                  break;
                }

                if (!(user._id === a._id)) {
                  _context8.next = 18;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "1003",
                  message: "The recipient is the sender"
                }));

              case 18:
                if (!(user.locked == 1)) {
                  _context8.next = 22;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "9995",
                  message: "You are  locked"
                }));

              case 22:
                if (!(a.locked == 1)) {
                  _context8.next = 26;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "9995",
                  message: "User is locked"
                }));

              case 26:
                l1 = user.ListFriends;
                l2 = a.ListFriends;
                count = 0;

                for (i = 0; i < l1.length; i++) {
                  for (j = 0; j < l2.length; j++) {
                    if (l1[i] === l2[j]) {
                      count = count + 1;
                    }
                  }
                }

                if (!(l1.length > 3000)) {
                  _context8.next = 34;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "9994",
                  message: "Your friends list is full"
                }));

              case 34:
                if (!(l2.length > 3000)) {
                  _context8.next = 36;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "9994",
                  message: "Their friends list is full"
                }));

              case 36:
                ar1 = user.Req;
                ar2 = a.FriendsRequest;
                c1 = false;
                c2 = false;
                _i = 0;

              case 41:
                if (!(_i < ar1.length)) {
                  _context8.next = 50;
                  break;
                }

                if (!(ar1[_i].toString() == a._id.toString())) {
                  _context8.next = 47;
                  break;
                }

                _context8.next = 45;
                return regeneratorRuntime.awrap(user.Req.splice(_i, 1));

              case 45:
                user.save();
                c1 = true;

              case 47:
                _i++;
                _context8.next = 41;
                break;

              case 50:
                _j = 0;

              case 51:
                if (!(_j < ar2.length)) {
                  _context8.next = 60;
                  break;
                }

                if (!(ar2[_j].toString() == user._id.toString())) {
                  _context8.next = 57;
                  break;
                }

                _context8.next = 55;
                return regeneratorRuntime.awrap(a.FriendsRequest.splice(_j, 1));

              case 55:
                a.save();
                c2 = true;

              case 57:
                _j++;
                _context8.next = 51;
                break;

              case 60:
                if (!(c1 && c2)) {
                  _context8.next = 62;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "1000",
                  message: "Delete request friend",
                  requets_friend: count
                }));

              case 62:
                _context8.next = 64;
                return regeneratorRuntime.awrap(user.Req.push(a._id));

              case 64:
                user.save();
                _context8.next = 67;
                return regeneratorRuntime.awrap(a.FriendsRequest.push(user._id));

              case 67:
                a.save();
                return _context8.abrupt("return", res.json({
                  code: "1000",
                  message: "OK",
                  requets_friend: count
                }));

              case 69:
                _context8.next = 72;
                break;

              case 71:
                return _context8.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't have user to send request"
                }));

              case 72:
                _context8.next = 79;
                break;

              case 74:
                if (!(user.Token === "" || user.Token === null)) {
                  _context8.next = 78;
                  break;
                }

                return _context8.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 78:
                return _context8.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 79:
                _context8.next = 82;
                break;

              case 81:
                return _context8.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 82:
              case "end":
                return _context8.stop();
            }
          }
        });
      });
    } else {
      return res.json({
        code: "1002",
        message: "Missing token or userid "
      });
    }
  } catch (error) {
    return res.json({
      code: "1005",
      message: error
    });
  }
}); //get user info

router.post("/get_user_info", function (req, res) {
  var _req$query5 = req.query,
      token = _req$query5.token,
      user_id = _req$query5.user_id;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee9(err, userData) {
      var user, resData;
      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (!err) {
                _context9.next = 4;
                break;
              }

              res.json({
                message: "Token is invalid",
                code: "9998"
              });
              _context9.next = 15;
              break;

            case 4:
              _context9.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                _id: userData.user.id
              }));

            case 6:
              user = _context9.sent;

              if (user) {
                _context9.next = 9;
                break;
              }

              return _context9.abrupt("return", res.json({
                message: "Can't find user with token provided",
                code: "9995"
              }));

            case 9:
              if (!(user.token !== token)) {
                _context9.next = 11;
                break;
              }

              return _context9.abrupt("return", res.json({
                message: "Token is invalid",
                code: "9998"
              }));

            case 11:
              if (!(user.locked == 1)) {
                _context9.next = 13;
                break;
              }

              return _context9.abrupt("return", res.json({
                message: "User is locked",
                code: "9995"
              }));

            case 13:
              resData = {
                id: user._id,
                username: user.username,
                created: user.created,
                description: user.description,
                avatar: user.avatar,
                cover_image: user.cover_image,
                address: user.address,
                city: user.city,
                country: user.country,
                listing: user.listing,
                online: user.online
              };
              return _context9.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: resData
              }));

            case 15:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
  } catch (error) {
    return res.json({
      message: "Server error",
      code: "1001"
    });
  }
});
router.post("/set_user_info", function (req, res) {
  var _req$query6 = req.query,
      token = _req$query6.token,
      username = _req$query6.username,
      description = _req$query6.description,
      avatar = _req$query6.avatar,
      address = _req$query6.address,
      city = _req$query6.city,
      country = _req$query6.country,
      cover_image = _req$query6.cover_image,
      link = _req$query6.link;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee10(err, userData) {
      var user, _userData, prop, updateUser;

      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              if (!err) {
                _context10.next = 4;
                break;
              }

              res.json({
                message: "Token is invalid",
                code: "9998"
              });
              _context10.next = 19;
              break;

            case 4:
              _context10.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                _id: _userData.user.id
              }));

            case 6:
              user = _context10.sent;

              if (user) {
                _context10.next = 9;
                break;
              }

              return _context10.abrupt("return", res.json({
                message: "Can't find user with token provided",
                code: "9995"
              }));

            case 9:
              if (!(user.token !== token)) {
                _context10.next = 11;
                break;
              }

              return _context10.abrupt("return", res.json({
                message: "Token is invalid",
                code: "9998"
              }));

            case 11:
              if (!(user.locked == 1)) {
                _context10.next = 13;
                break;
              }

              return _context10.abrupt("return", res.json({
                message: "User is locked",
                code: "9995"
              }));

            case 13:
              _userData = {
                username: username,
                description: description,
                avatar: avatar,
                cover_image: cover_image,
                address: address,
                city: city,
                country: country,
                listing: listing
              };

              for (prop in _userData) {
                if (!_userData[prop]) delete _userData[prop];
              }

              _context10.next = 17;
              return regeneratorRuntime.awrap(User.findOneAndUpdate({
                _id: _userData.user.id
              }, _userData));

            case 17:
              updateUser = _context10.sent;
              return _context10.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: _userData
              }));

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
  } catch (error) {
    return res.json({
      message: "Server error",
      code: "1001"
    });
  }
});
router.post("/get_requested_friends", function (req, res) {
  var _req$query7 = req.query,
      token = _req$query7.token,
      index = _req$query7.index,
      count = _req$query7.count;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee12(err, userData) {
      var user, responseData;
      return regeneratorRuntime.async(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              if (!err) {
                _context12.next = 4;
                break;
              }

              res.json({
                message: "Token is invalid",
                code: "9998"
              });
              _context12.next = 16;
              break;

            case 4:
              _context12.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                _id: userData.user.id
              }));

            case 6:
              user = _context12.sent;

              if (user) {
                _context12.next = 9;
                break;
              }

              return _context12.abrupt("return", res.json({
                message: "Can't find user with token provided",
                code: "9995"
              }));

            case 9:
              if (!(user.token !== token)) {
                _context12.next = 11;
                break;
              }

              return _context12.abrupt("return", res.json({
                message: "Token is invalid",
                code: "9998"
              }));

            case 11:
              if (!(user.locked == 1)) {
                _context12.next = 13;
                break;
              }

              return _context12.abrupt("return", res.json({
                message: "User is locked",
                code: "9995"
              }));

            case 13:
              requestData = user.FriendsRequest.map(function _callee11(friend) {
                var findFriend;
                return regeneratorRuntime.async(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return regeneratorRuntime.awrap(User.findOne({
                          _id: friend
                        }));

                      case 2:
                        findFriend = _context11.sent;
                        return _context11.abrupt("return", {
                          id: findFriend.id,
                          username: findFriend.username,
                          avatar: findFriend.avatar
                        });

                      case 4:
                      case "end":
                        return _context11.stop();
                    }
                  }
                });
              });
              responseData = {
                request: requestData,
                total: user.FriendsRequest.length
              };
              return _context12.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: responseData
              }));

            case 16:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
  } catch (error) {
    return res.json({
      message: "Server error",
      code: "1001"
    });
  }
});
router.post("/set_devtoken", function (req, res) {
  var _req$query8 = req.query,
      token = _req$query8.token,
      devtoken = _req$query8.devtoken;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee13(err, userData) {
      var user, updateUser;
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
              _context13.next = 15;
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
              updateUser = DeviceToken.findOneAndUpdate({
                UserId: user.id
              }, {
                DeviceToken: devtoken
              });
              return _context13.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: {
                  userId: updateUser.id,
                  DeviceToken: updateUser.DeviceToken
                }
              }));

            case 15:
            case "end":
              return _context13.stop();
          }
        }
      });
    });
  } catch (error) {
    return res.json({
      message: "Server error",
      code: "1001"
    });
  }
});
router.post("/get_list_friends", function (req, res) {
  var token = req.query.token;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee15(err, userData) {
      var user, responseData;
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              if (!err) {
                _context15.next = 4;
                break;
              }

              res.json({
                message: "Token is invalid",
                code: "9998"
              });
              _context15.next = 18;
              break;

            case 4:
              _context15.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                _id: userData.user.id
              }));

            case 6:
              user = _context15.sent;

              if (user) {
                _context15.next = 9;
                break;
              }

              return _context15.abrupt("return", res.json({
                message: "Can't find user with token provided",
                code: "9995"
              }));

            case 9:
              if (!(user.token !== token)) {
                _context15.next = 11;
                break;
              }

              return _context15.abrupt("return", res.json({
                message: "Token is invalid",
                code: "9998"
              }));

            case 11:
              if (!(user.locked == 1)) {
                _context15.next = 13;
                break;
              }

              return _context15.abrupt("return", res.json({
                message: "User is locked",
                code: "9995"
              }));

            case 13:
              _context15.next = 15;
              return regeneratorRuntime.awrap(Promise.all(user.ListFriends.map(function _callee14(friend) {
                var findFriend;
                return regeneratorRuntime.async(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return regeneratorRuntime.awrap(User.findOne({
                          _id: friend
                        }));

                      case 2:
                        findFriend = _context14.sent;
                        return _context14.abrupt("return", {
                          id: findFriend._id,
                          username: findFriend.username,
                          avatar: findFriend.avatar,
                          is_online: findFriend.is_online
                        });

                      case 4:
                      case "end":
                        return _context14.stop();
                    }
                  }
                });
              })));

            case 15:
              requestData = _context15.sent;
              responseData = {
                friends: requestData,
                total: user.FriendsRequest.length
              };
              return _context15.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: responseData
              }));

            case 18:
            case "end":
              return _context15.stop();
          }
        }
      });
    });
  } catch (error) {
    return res.json({
      message: "Server error",
      code: "1001"
    });
  }
});
module.exports = router;