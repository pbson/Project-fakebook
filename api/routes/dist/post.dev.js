"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require("express");

var router = express.Router();

var jwt = require("jsonwebtoken");

var mongoose = require('mongoose');

var User = require("../../models/User");

var Post = require("../../models/Post");

var Report = require("../../models/Report");

var cloudinary = require('cloudinary').v2;

var server = require("../../server");

var Notification = require('../../push_notification/send');

var newPostLikeNotification = Notification.newCommentNotification;
var getUserDeviceToken = Notification.getUserDeviceToken;
router.post("/add_post/", function (req, res) {
  var token = req.query.token;
  var described = req.query.described;
  var status = req.query.status;
  console.log(req.files);

  try {
    if (token) {
      jwt.verify(token, "secretToken", function _callee(err, userData) {
        var id, user, post, imagethumb, video, videopath, paththumb, image1, image1path, image2, image2path, image3, image3path, image4, image4path;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!err) {
                  _context.next = 4;
                  break;
                }

                res.json({
                  code: "1004s",
                  message: "Parameter value is invalid token"
                });
                _context.next = 84;
                break;

              case 4:
                id = userData.user.id;
                _context.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context.sent;

                if (!user) {
                  _context.next = 83;
                  break;
                }

                if (!(token === user.token)) {
                  _context.next = 76;
                  break;
                }

                post = new Post();

                if (!(req.files !== undefined)) {
                  _context.next = 68;
                  break;
                }

                if (!(req.files.video !== undefined && req.files.imagethumb !== undefined)) {
                  _context.next = 28;
                  break;
                }

                imagethumb = req.files.imagethumb;
                video = req.files.video;

                if (!(video.mimetype == "video/mp4" && (imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png"))) {
                  _context.next = 26;
                  break;
                }

                if (!(video.size < 10 * 1024 * 1024)) {
                  _context.next = 25;
                  break;
                }

                _context.next = 19;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(video.tempFilePath, {
                  resource_type: "video"
                }, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    videopath = result.url;
                  }
                }));

              case 19:
                if (!(imagethumb.size < 4 * 1024 * 1024)) {
                  _context.next = 23;
                  break;
                }

                _context.next = 22;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(imagethumb.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    paththumb = result.url;
                  }
                }));

              case 22:
                post.Video.push({
                  url: videopath,
                  thumb: paththumb
                });

              case 23:
                _context.next = 26;
                break;

              case 25:
                return _context.abrupt("return", res.json({
                  code: "1006",
                  message: "Video size is too big"
                }));

              case 26:
                _context.next = 68;
                break;

              case 28:
                if (!(req.files.image1 !== undefined)) {
                  _context.next = 38;
                  break;
                }

                image1 = req.files.image1;

                if (!(image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image2/png")) {
                  _context.next = 38;
                  break;
                }

                if (!(image1.size < 4 * 1024 * 1024)) {
                  _context.next = 37;
                  break;
                }

                _context.next = 34;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image1.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image1path = result.url;
                  }
                }));

              case 34:
                post.Image.push({
                  id: 1,
                  url: image1path
                });
                _context.next = 38;
                break;

              case 37:
                return _context.abrupt("return", res.json({
                  code: "1006",
                  message: "Image1 size is too big"
                }));

              case 38:
                if (!(req.files.image2 !== undefined)) {
                  _context.next = 48;
                  break;
                }

                image2 = req.files.image2;

                if (!(image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png")) {
                  _context.next = 48;
                  break;
                }

                if (!(image2.size < 4 * 1024 * 1024)) {
                  _context.next = 47;
                  break;
                }

                _context.next = 44;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image2.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image2path = result.url;
                  }
                }));

              case 44:
                post.Image.push({
                  id: 2,
                  url: image2path
                });
                _context.next = 48;
                break;

              case 47:
                return _context.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 48:
                if (!(req.files.image3 !== undefined)) {
                  _context.next = 58;
                  break;
                }

                image3 = req.files.image3;

                if (!(image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png")) {
                  _context.next = 58;
                  break;
                }

                if (!(image3.size < 4 * 1024 * 1024)) {
                  _context.next = 57;
                  break;
                }

                _context.next = 54;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image3.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image3path = result.url;
                  }
                }));

              case 54:
                post.Image.push({
                  id: 3,
                  url: image3path
                });
                _context.next = 58;
                break;

              case 57:
                return _context.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 58:
                if (!(req.files.image4 !== undefined)) {
                  _context.next = 68;
                  break;
                }

                image4 = req.files.image4;

                if (!(image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png")) {
                  _context.next = 68;
                  break;
                }

                if (!(image4.size < 4 * 1024 * 1024)) {
                  _context.next = 67;
                  break;
                }

                _context.next = 64;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image4.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image4path = result.url;
                  }
                }));

              case 64:
                post.Image.push({
                  id: 4,
                  url: image4path
                });
                _context.next = 68;
                break;

              case 67:
                return _context.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 68:
                post.User_id = user._id;
                post.Described = described;
                post.Status = status;
                post.CreatedAt = Date.now();
                post.save();
                return _context.abrupt("return", res.json({
                  code: "1000",
                  message: "OK",
                  data: post
                }));

              case 76:
                if (!(user.token === "" || user.token === null)) {
                  _context.next = 80;
                  break;
                }

                return _context.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 80:
                return _context.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 81:
                _context.next = 84;
                break;

              case 83:
                return _context.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 84:
              case "end":
                return _context.stop();
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
});
router.post("/add_post2/", function (req, res) {
  var token = req.query.token;
  var described = req.query.described;
  var status = req.query.status;

  try {
    if (token) {
      jwt.verify(token, "secretToken", function _callee2(err, userData) {
        var id, user, post;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!err) {
                  _context2.next = 4;
                  break;
                }

                res.json({
                  code: "1004s",
                  message: "Parameter value is invalid token"
                });
                _context2.next = 28;
                break;

              case 4:
                id = userData.user.id;
                _context2.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context2.sent;

                if (!user) {
                  _context2.next = 27;
                  break;
                }

                if (!(token === user.token)) {
                  _context2.next = 20;
                  break;
                }

                post = new Post();
                post.Image = _toConsumableArray(req.body);
                post.User_id = user._id;
                post.Described = described;
                post.Status = status;
                post.CreatedAt = Date.now();
                post.save();
                return _context2.abrupt("return", res.json({
                  code: "1000",
                  message: "OK",
                  data: post
                }));

              case 20:
                if (!(user.token === "" || user.token === null)) {
                  _context2.next = 24;
                  break;
                }

                return _context2.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 24:
                return _context2.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 25:
                _context2.next = 28;
                break;

              case 27:
                return _context2.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 28:
              case "end":
                return _context2.stop();
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
});
router.post("/get_post/", function (req, res) {
  var token = req.query.token;
  var id = req.query.id;

  try {
    if (token && id) {
      jwt.verify(token, "secretToken", function _callee3(err, userData) {
        var user, post, data, user1;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!err) {
                  _context3.next = 4;
                  break;
                }

                res.json({
                  code: "1004",
                  message: "Parameter value is invalid"
                });
                _context3.next = 43;
                break;

              case 4:
                _context3.next = 6;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: userData.user.id
                }));

              case 6:
                user = _context3.sent;

                if (!user) {
                  _context3.next = 42;
                  break;
                }

                if (!(token === user.token)) {
                  _context3.next = 35;
                  break;
                }

                _context3.next = 11;
                return regeneratorRuntime.awrap(Post.findOne({
                  _id: id
                }));

              case 11:
                post = _context3.sent;

                if (!post) {
                  _context3.next = 32;
                  break;
                }

                data = {};
                data.id = post._id;
                data.described = post.Described;
                data.status = post.Status;
                data.created = post.CreatedAt;
                data.modified = post.UpdatedAt;
                data.like = post.Like.length;
                data.comment = post.Comment.length;

                if (post.Like.find(function (element) {
                  return element == user._id;
                })) {
                  data.is_liked = 1;
                } else {
                  data.is_liked = 0;
                }

                data.image = post.Image;
                data.video = post.Video;

                if (user._id = post.User_id) {
                  data.can_edit = 1;
                } else {
                  data.can_edit = 0;
                }

                _context3.next = 27;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: post.User_id
                }));

              case 27:
                user1 = _context3.sent;

                if (user1) {
                  data.author = {
                    id: user1._id,
                    name: user1.phonenumber,
                    avatar: user1.avatar
                  };

                  if (user1.locked) {
                    data.can_comment = 0;
                  } else {
                    data.can_comment = 1;
                  }
                }

                return _context3.abrupt("return", res.json({
                  code: "1000",
                  message: "ok",
                  data: data
                }));

              case 32:
                return _context3.abrupt("return", res.json({
                  code: "9992",
                  message: "Don't find post by id"
                }));

              case 33:
                _context3.next = 40;
                break;

              case 35:
                if (!(user.token === "" || user.token === null)) {
                  _context3.next = 39;
                  break;
                }

                return _context3.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 39:
                return _context3.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 40:
                _context3.next = 43;
                break;

              case 42:
                return _context3.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 43:
              case "end":
                return _context3.stop();
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
});
router.post("/delete_post/", function (req, res) {
  var token = req.query.token;
  var id = req.query.id;

  try {
    if (token && id) {
      jwt.verify(token, "secretToken", function _callee4(err, userData) {
        var user, post;
        return regeneratorRuntime.async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!err) {
                  _context4.next = 4;
                  break;
                }

                res.json({
                  code: "1004",
                  message: "Parameter value is invalid"
                });
                _context4.next = 36;
                break;

              case 4:
                _context4.next = 6;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: userData.user.id
                }));

              case 6:
                user = _context4.sent;

                if (!user) {
                  _context4.next = 35;
                  break;
                }

                if (!(token === user.token)) {
                  _context4.next = 28;
                  break;
                }

                _context4.next = 11;
                return regeneratorRuntime.awrap(Post.findOne({
                  _id: id
                }));

              case 11:
                post = _context4.sent;

                if (!post) {
                  _context4.next = 25;
                  break;
                }

                if (!(user._id == post.User_id)) {
                  _context4.next = 22;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context4.next = 18;
                  break;
                }

                return _context4.abrupt("return", res.json({
                  code: "9995",
                  message: "User is locked"
                }));

              case 18:
                _context4.next = 20;
                return regeneratorRuntime.awrap(Post.findOneAndDelete({
                  _id: id
                }, function (err, data) {
                  if (err) {
                    return res.json({
                      code: "1001",
                      message: "Can not connect database"
                    });
                  } else {
                    return res.json({
                      code: "1000",
                      message: "OK",
                      data: data
                    });
                  }
                }));

              case 20:
                _context4.next = 23;
                break;

              case 22:
                return _context4.abrupt("return", res.json({
                  code: "1004",
                  message: "This post is not of the user"
                }));

              case 23:
                _context4.next = 26;
                break;

              case 25:
                return _context4.abrupt("return", res.json({
                  code: "9992",
                  message: "Don't find post by id"
                }));

              case 26:
                _context4.next = 33;
                break;

              case 28:
                if (!(user.token === "" || user.token === null)) {
                  _context4.next = 32;
                  break;
                }

                return _context4.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 32:
                return _context4.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 33:
                _context4.next = 36;
                break;

              case 35:
                return _context4.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 36:
              case "end":
                return _context4.stop();
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
});
router.post("/report_post/", function (req, res) {
  var token = req.query.token;
  var id = req.query.id;
  var subject = req.query.subject;
  var details = req.query.details;

  try {
    if (token && id) {
      jwt.verify(token, "secretToken", function _callee5(err, userData) {
        var user, post, report;
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
                _context5.next = 40;
                break;

              case 4:
                _context5.next = 6;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: userData.user.id
                }));

              case 6:
                user = _context5.sent;

                if (!user) {
                  _context5.next = 39;
                  break;
                }

                if (!(token === user.token)) {
                  _context5.next = 32;
                  break;
                }

                _context5.next = 11;
                return regeneratorRuntime.awrap(Post.findOne({
                  _id: id
                }));

              case 11:
                post = _context5.sent;

                if (!post) {
                  _context5.next = 29;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context5.next = 17;
                  break;
                }

                return _context5.abrupt("return", res.json({
                  code: "9995",
                  message: "User is locked"
                }));

              case 17:
                report = new Report();
                report.Subject = subject;
                report.Details = details;
                report.User_id = user._id;
                report.Post_id = post._id;
                report.ReportedAt = Date.now();
                report.save();
                post.Report.push(report._id);
                post.save();
                return _context5.abrupt("return", res.json({
                  code: "1000",
                  message: "OK",
                  data: report
                }));

              case 27:
                _context5.next = 30;
                break;

              case 29:
                return _context5.abrupt("return", res.json({
                  code: "9992",
                  message: "Don't find post by id"
                }));

              case 30:
                _context5.next = 37;
                break;

              case 32:
                if (!(user.token === "" || user.token === null)) {
                  _context5.next = 36;
                  break;
                }

                return _context5.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 36:
                return _context5.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 37:
                _context5.next = 40;
                break;

              case 39:
                return _context5.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 40:
              case "end":
                return _context5.stop();
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
});
router.post("/edit_post/", function (req, res) {
  var id = req.query.id;
  var token = req.query.token;
  var described = req.query.described;
  var status = req.query.status;

  try {
    if (token && id) {
      jwt.verify(token, "secretToken", function _callee6(err, userData) {
        var user, post, video, imagethumb, videopath, paththumb, image1, image1path, image2, image2path, image3, image3path, image4, image4path;
        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!err) {
                  _context6.next = 4;
                  break;
                }

                res.json({
                  code: "1004",
                  message: "Parameter value is invalid"
                });
                _context6.next = 105;
                break;

              case 4:
                _context6.next = 6;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: userData.user.id
                }));

              case 6:
                user = _context6.sent;

                if (!user) {
                  _context6.next = 104;
                  break;
                }

                if (!(token === user.token)) {
                  _context6.next = 97;
                  break;
                }

                _context6.next = 11;
                return regeneratorRuntime.awrap(Post.findOne({
                  _id: id
                }));

              case 11:
                post = _context6.sent;
                post.Image = [];
                post.Video = [];

                if (!post) {
                  _context6.next = 94;
                  break;
                }

                if (!(user._id == post.User_id)) {
                  _context6.next = 91;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context6.next = 20;
                  break;
                }

                return _context6.abrupt("return", res.json({
                  code: "9995",
                  message: "User is locked"
                }));

              case 20:
                post.Described = described;
                post.Status = status;

                if (!(req.files !== undefined)) {
                  _context6.next = 84;
                  break;
                }

                if (!(req.files.video !== undefined && req.files.imagethumb !== undefined)) {
                  _context6.next = 40;
                  break;
                }

                video = req.files.video;
                imagethumb = req.files.imagethumb;

                if (!(video.mimetype == "video/mp4" && (imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png"))) {
                  _context6.next = 38;
                  break;
                }

                if (!(video.size < 10 * 1024 * 1024)) {
                  _context6.next = 37;
                  break;
                }

                _context6.next = 30;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(video.tempFilePath, {
                  resource_type: "video"
                }, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    videopath = result.url;
                  }
                }));

              case 30:
                if (!(imagethumb.size < 4 * 1024 * 1024)) {
                  _context6.next = 34;
                  break;
                }

                _context6.next = 33;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(imagethumb.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    paththumb = result.url;
                  }
                }));

              case 33:
                post.Video[0] = {
                  url: videopath,
                  thumb: paththumb
                };

              case 34:
                post.Image = [];
                _context6.next = 38;
                break;

              case 37:
                return _context6.abrupt("return", res.json({
                  code: "1006",
                  message: "Video size is too big"
                }));

              case 38:
                _context6.next = 84;
                break;

              case 40:
                if (!(req.files.image1 !== undefined)) {
                  _context6.next = 51;
                  break;
                }

                image1 = req.files.image1;

                if (!(image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image2/png")) {
                  _context6.next = 51;
                  break;
                }

                if (!(image1.size < 4 * 1024 * 1024)) {
                  _context6.next = 49;
                  break;
                }

                _context6.next = 46;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image1.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image1path = result.url;
                  }
                }));

              case 46:
                post.Image[0] = {
                  id: 1,
                  url: image1path
                };
                _context6.next = 50;
                break;

              case 49:
                return _context6.abrupt("return", res.json({
                  code: "1006",
                  message: "Image1 size is too big"
                }));

              case 50:
                post.Video = [];

              case 51:
                if (!(req.files.image2 !== undefined)) {
                  _context6.next = 62;
                  break;
                }

                image2 = req.files.image2;

                if (!(image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png")) {
                  _context6.next = 62;
                  break;
                }

                if (!(image2.size < 4 * 1024 * 1024)) {
                  _context6.next = 60;
                  break;
                }

                _context6.next = 57;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image2.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image2path = result.url;
                  }
                }));

              case 57:
                post.Image[1] = {
                  id: 2,
                  url: image2path
                };
                _context6.next = 61;
                break;

              case 60:
                return _context6.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 61:
                post.Video = [];

              case 62:
                if (!(req.files.image3 !== undefined)) {
                  _context6.next = 73;
                  break;
                }

                image3 = req.files.image3;

                if (!(image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png")) {
                  _context6.next = 73;
                  break;
                }

                if (!(image3.size < 4 * 1024 * 1024)) {
                  _context6.next = 71;
                  break;
                }

                _context6.next = 68;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image3.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image3path = result.url;
                  }
                }));

              case 68:
                post.Image[2] = {
                  id: 3,
                  url: image3path
                };
                _context6.next = 72;
                break;

              case 71:
                return _context6.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 72:
                post.Video = [];

              case 73:
                if (!(req.files.image4 !== undefined)) {
                  _context6.next = 84;
                  break;
                }

                image4 = req.files.image4;

                if (!(image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png")) {
                  _context6.next = 84;
                  break;
                }

                if (!(image4.size < 4 * 1024 * 1024)) {
                  _context6.next = 82;
                  break;
                }

                _context6.next = 79;
                return regeneratorRuntime.awrap(cloudinary.uploader.upload(image4.tempFilePath, function (err, result) {
                  if (err) {
                    return res.json({
                      code: "1007",
                      message: err
                    });
                  } else {
                    image4path = result.url;
                  }
                }));

              case 79:
                post.Image[3] = {
                  id: 4,
                  url: image4path
                };
                _context6.next = 83;
                break;

              case 82:
                return _context6.abrupt("return", res.json({
                  code: "1006",
                  message: "Image size is too big"
                }));

              case 83:
                post.Video = [];

              case 84:
                post.UpdatedAt = Date.now();
                post.markModified('Image');
                post.markModified('Video');
                post.save().then(console.log);
                return _context6.abrupt("return", res.json({
                  code: "1000",
                  message: "OK",
                  data: post
                }));

              case 89:
                _context6.next = 92;
                break;

              case 91:
                return _context6.abrupt("return", res.json({
                  code: "1004",
                  message: "This post is not of the user"
                }));

              case 92:
                _context6.next = 95;
                break;

              case 94:
                return _context6.abrupt("return", res.json({
                  code: "9992",
                  message: "Don't find post by id"
                }));

              case 95:
                _context6.next = 102;
                break;

              case 97:
                if (!(user.token === "" || user.token === null)) {
                  _context6.next = 101;
                  break;
                }

                return _context6.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 101:
                return _context6.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 102:
                _context6.next = 105;
                break;

              case 104:
                return _context6.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 105:
              case "end":
                return _context6.stop();
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
}); //like

router.post("/like", function _callee8(req, res) {
  var _req$query, token, id, post;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$query = req.query, token = _req$query.token, id = _req$query.id;
          _context8.prev = 1;

          if (!(Object.keys(req.query).length < 2 || !token || !id)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: "Missing field",
            code: "1002"
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(Post.findOne({
            _id: id
          }));

        case 6:
          post = _context8.sent;

          if (post) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.json({
            message: "Wrong post_id or post doesn't exist",
            code: "9992"
          }));

        case 9:
          //Decode token to get user_id
          jwt.verify(token, "secretToken", function _callee7(err, userData) {
            var user, _post, deviceToken;

            return regeneratorRuntime.async(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    if (!err) {
                      _context7.next = 4;
                      break;
                    }

                    res.json({
                      message: "Token is invalid",
                      code: "9998"
                    });
                    _context7.next = 36;
                    break;

                  case 4:
                    _context7.next = 6;
                    return regeneratorRuntime.awrap(User.findOne({
                      _id: userData.user.id
                    }));

                  case 6:
                    user = _context7.sent;

                    if (user) {
                      _context7.next = 9;
                      break;
                    }

                    return _context7.abrupt("return", res.json({
                      message: "Can't find user with token provided",
                      code: "9995"
                    }));

                  case 9:
                    if (!(user.token !== token)) {
                      _context7.next = 11;
                      break;
                    }

                    return _context7.abrupt("return", res.json({
                      message: "Token is invalid",
                      code: "9998"
                    }));

                  case 11:
                    if (!(user.locked == 1)) {
                      _context7.next = 13;
                      break;
                    }

                    return _context7.abrupt("return", res.json({
                      message: "User is locked",
                      code: "9995"
                    }));

                  case 13:
                    _context7.prev = 13;
                    _context7.next = 16;
                    return regeneratorRuntime.awrap(Post.findOne({
                      _id: id
                    }));

                  case 16:
                    _post = _context7.sent;

                    if (!_post.Like.includes(user.id)) {
                      _context7.next = 23;
                      break;
                    }

                    _context7.next = 20;
                    return regeneratorRuntime.awrap(Post.findOneAndUpdate({
                      _id: id
                    }, {
                      $pull: {
                        Like: user.id
                      }
                    }, {
                      "new": true
                    }));

                  case 20:
                    _post = _context7.sent;
                    _context7.next = 30;
                    break;

                  case 23:
                    _context7.next = 25;
                    return regeneratorRuntime.awrap(Post.findOneAndUpdate({
                      _id: id
                    }, {
                      $push: {
                        Like: user.id
                      }
                    }, {
                      "new": true
                    }));

                  case 25:
                    _post = _context7.sent;
                    _context7.next = 28;
                    return regeneratorRuntime.awrap(getUserDeviceToken(_post.User_id));

                  case 28:
                    deviceToken = _context7.sent;
                    newLikeNotification(deviceToken, user.phonenumber, id);

                  case 30:
                    return _context7.abrupt("return", res.json({
                      message: 'OK',
                      code: "1000",
                      data: {
                        like: _post.Like.length
                      }
                    }));

                  case 33:
                    _context7.prev = 33;
                    _context7.t0 = _context7["catch"](13);
                    return _context7.abrupt("return", res.json({
                      message: _context7.t0,
                      code: "1005"
                    }));

                  case 36:
                  case "end":
                    return _context7.stop();
                }
              }
            }, null, null, [[13, 33]]);
          });
          _context8.next = 15;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](1);
          return _context8.abrupt("return", res.json({
            message: "Server error",
            code: "1001"
          }));

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 12]]);
}); //get listt post
// route.post("/get_list_post/")

router.post("/get_list_post/", function (req, res) {
  console.log('right on');
  var token = req.query.token;
  var last_id = req.query.last_id;
  var index = req.query.index;
  var count = req.query.count;

  try {
    if (token) {
      jwt.verify(token, "secretToken", function _callee11(err, userData) {
        var id, user, array_post, post, last_post, count_1, post_slice, posts, l, data;
        return regeneratorRuntime.async(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!err) {
                  _context11.next = 4;
                  break;
                }

                res.json({
                  code: "1004s",
                  message: "Parameter value is invalid token"
                });
                _context11.next = 41;
                break;

              case 4:
                id = userData.user.id;
                _context11.next = 7;
                return regeneratorRuntime.awrap(User.findOne({
                  _id: id
                }));

              case 7:
                user = _context11.sent;

                if (!user) {
                  _context11.next = 40;
                  break;
                }

                if (!(token === user.token)) {
                  _context11.next = 33;
                  break;
                }

                if (!(user.locked == 1)) {
                  _context11.next = 12;
                  break;
                }

                return _context11.abrupt("return", res.json({
                  code: "9995",
                  message: "You are  locked"
                }));

              case 12:
                array_post = user.ListFriends;
                _context11.next = 15;
                return regeneratorRuntime.awrap(Promise.all(user.ListFriends.map(function _callee9(id_1) {
                  var user_1;
                  return regeneratorRuntime.async(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          _context9.next = 2;
                          return regeneratorRuntime.awrap(User.findOne({
                            _id: id_1
                          }));

                        case 2:
                          user_1 = _context9.sent;
                          array_post = array_post.concat(user_1.ListFriends);

                        case 4:
                        case "end":
                          return _context9.stop();
                      }
                    }
                  });
                })));

              case 15:
                array_post = array_post.filter(function (item, post) {
                  return array_post.indexOf(item) === post;
                }); // const index_1 = array_post.indexOf(user._id);
                // if (index_1 > -1) {
                //     array_post.splice(index_1, 1);
                // }

                _context11.next = 18;
                return regeneratorRuntime.awrap(Post.find({
                  User_id: {
                    $in: array_post
                  }
                }).sort({
                  CreatedAt: 1
                }));

              case 18:
                post = _context11.sent;
                last_post = -1;

                if (last_id) {
                  last_post = post.findIndex(function (p) {
                    return p._id == last_id;
                  });
                }

                count_1 = 20;

                if (count) {
                  count_1 = count;
                }

                post_slice = post.splice(last_post + 1, count_1); // let post_slice = Post.paginate(post,{limit:count_1});

                _context11.next = 26;
                return regeneratorRuntime.awrap(Promise.all(post_slice.map(function _callee10(post) {
                  var r_post, user1;
                  return regeneratorRuntime.async(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          r_post = {};
                          r_post.id = post._id;
                          r_post.described = post.Described;
                          r_post.status = post.Status;
                          r_post.created = post.CreatedAt.toUTCString();
                          r_post.modified = post.UpdatedAt;
                          r_post.like = post.Like.length;
                          r_post.comment = post.Comment.length;

                          if (post.Like.find(function (element) {
                            return element == user._id;
                          })) {
                            r_post.is_liked = 1;
                          } else {
                            r_post.is_liked = 0;
                          }

                          r_post.image = post.Image;
                          r_post.video = post.Video;

                          if (user._id = post.User_id) {
                            r_post.can_edit = 1;
                          } else {
                            r_post.can_edit = 0;
                          }

                          _context10.next = 14;
                          return regeneratorRuntime.awrap(User.findOne({
                            _id: post.User_id
                          }));

                        case 14:
                          user1 = _context10.sent;

                          if (user1) {
                            r_post.author = {
                              id: user1._id,
                              name: user1.phonenumber,
                              avatar: user1.avatar
                            };

                            if (user1.locked) {
                              r_post.can_comment = 0;
                            } else {
                              r_post.can_comment = 1;
                            }
                          }

                          return _context10.abrupt("return", r_post);

                        case 17:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  });
                })));

              case 26:
                posts = _context11.sent;
                l = post_slice.length; // let last_id_1 = post_slice[l - 1]._id

                data = {};
                data.post = posts; // data.last_id = last_id_1

                return _context11.abrupt("return", res.json({
                  code: "1000",
                  message: "Ok",
                  data: data
                }));

              case 33:
                if (!(user.token === "" || user.token === null)) {
                  _context11.next = 37;
                  break;
                }

                return _context11.abrupt("return", res.json({
                  code: "1004",
                  message: "User don't have token in db"
                }));

              case 37:
                return _context11.abrupt("return", res.json({
                  code: "1004",
                  message: "Token is invalid"
                }));

              case 38:
                _context11.next = 41;
                break;

              case 40:
                return _context11.abrupt("return", res.json({
                  code: "9995",
                  message: "Don't find user by token"
                }));

              case 41:
              case "end":
                return _context11.stop();
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
});
module.exports = router;