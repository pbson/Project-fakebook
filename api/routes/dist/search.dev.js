"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require("express");

var router = express.Router();

var jwt = require("jsonwebtoken");

var User = require("../../models/User");

var Post = require("../../models/Post");

var _require = require("."),
    post = _require.post;

router.post("/get_search", function (req, res) {
  var _req$query = req.query,
      token = _req$query.token,
      keyword = _req$query.keyword,
      user_id = _req$query.user_id,
      index = _req$query.index,
      count = _req$query.count;

  try {
    //Check if params are missing
    if (Object.keys(req.query).length <= 4 || !token || !index || !count || !keyword || !user_id) {
      return res.json({
        message: "Missing field",
        code: "1002"
      });
    } //Decode token to get user_id


    jwt.verify(token, "secretToken", function _callee(err, userData) {
      var user, _post;

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
              _context.next = 18;
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
              _context.next = 15;
              return regeneratorRuntime.awrap(Post.find({
                $text: {
                  $search: keyword
                }
              }).sort({
                CreatedAt: 1
              }).skip(new Number(index)).limit(new Number(count)));

            case 15:
              _post = _context.sent;
              //create return data array
              data = _post.Status;
              return _context.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: _post.Status
              }));

            case 18:
            case "end":
              return _context.stop();
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
router.post("/get_search_user", function (req, res) {
  var _req$query2 = req.query,
      token = _req$query2.token,
      keyword = _req$query2.keyword,
      index = _req$query2.index,
      count = _req$query2.count;

  try {
    //Decode token to get user_id
    jwt.verify(token, "secretToken", function _callee2(err, userData) {
      var user, findUser, _data;

      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!err) {
                _context2.next = 4;
                break;
              }

              res.json({
                message: "Token is invalid",
                code: "9998"
              });
              _context2.next = 19;
              break;

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                _id: userData.user.id
              }));

            case 6:
              user = _context2.sent;

              if (user) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", res.json({
                message: "Can't find user with token provided",
                code: "9995"
              }));

            case 9:
              if (!(user.token !== token)) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", res.json({
                message: "Token is invalid",
                code: "9998"
              }));

            case 11:
              if (!(user.locked == 1)) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("return", res.json({
                message: "User is locked",
                code: "9995"
              }));

            case 13:
              _context2.next = 15;
              return regeneratorRuntime.awrap(User.find({
                $text: {
                  $search: keyword
                }
              }).skip(new Number(index)).limit(new Number(count)));

            case 15:
              findUser = _context2.sent;
              //create return data array
              _data = [];
              findUser.forEach(function (user) {
                console.log(user);
                _data = [].concat(_toConsumableArray(_data), [{
                  username: user.username,
                  avatar: user.avatar,
                  id: user._id
                }]);
              });
              return _context2.abrupt("return", res.json({
                code: "1000",
                message: "ok",
                data: _data
              }));

            case 19:
            case "end":
              return _context2.stop();
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