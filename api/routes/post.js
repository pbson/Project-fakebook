const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const User = require("../../models/User");
const Post = require("../../models/Post");
const Report = require("../../models/Report");
const cloudinary = require('cloudinary').v2
const server = require("../../server");

const Notification = require('../../push_notification/send')
const newPostLikeNotification = Notification.newCommentNotification;
const getUserDeviceToken = Notification.getUserDeviceToken;

router.post("/add_post/", (req, res) => {
    const token = req.query.token;
    const described = req.query.described;
    const status = req.query.status
    console.log(req.files)
    try {
        if (token) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004s",
                        message: "Parameter value is invalid token"
                    });
                } else {
                    const id = userData.user.id
                    let user = await User.findOne({ _id: id })
                    if (user) {
                        if (token === user.token) {
                            let post = new Post();
                            if (req.files !== undefined) {
                                if (req.files.video !== undefined && req.files.imagethumb !== undefined) {
                                    const imagethumb = req.files.imagethumb
                                    const video = req.files.video;
                                    if (video.mimetype == "video/mp4" && (imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png")) {
                                        if (video.size < (10 * 1024 * 1024)) {
                                            let videopath;
                                            let paththumb;
                                            await cloudinary.uploader.upload(video.tempFilePath, { resource_type: "video" }, (err, result) => {
                                                if (err) {
                                                    return res.json({
                                                        code: "1007",
                                                        message: err,
                                                    })
                                                } else {
                                                    videopath = result.url
                                                }
                                            })
                                            if (imagethumb.size < 4 * 1024 * 1024) {
                                                await cloudinary.uploader.upload(imagethumb.tempFilePath, (err, result) => {
                                                    if (err) {
                                                        return res.json({
                                                            code: "1007",
                                                            message: err,
                                                        })
                                                    } else {
                                                        paththumb = result.url
                                                    }
                                                })
                                                post.Video.push({ url: videopath, thumb: paththumb });
                                            }
                                        } else {
                                            return res.json({
                                                code: "1006",
                                                message: "Video size is too big"
                                            })
                                        }
                                    }
                                } else {
                                    if (req.files.image1 !== undefined) {
                                        const image1 = req.files.image1;
                                        if (image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image/png") {
                                            if (image1.size < (4 * 1024 * 1024)) {
                                                let image1path;
                                                await cloudinary.uploader.upload(image1.tempFilePath, (err, result) => {
                                                    if (err) {
                                                        return res.json({
                                                            code: "1007",
                                                            message: err,
                                                        })
                                                    } else {
                                                        image1path = result.url
                                                    }
                                                })
                                                post.Image.push({ id: 1, url: image1path })
                                            } else {
                                                return res.json({
                                                    code: "1006",
                                                    message: "Image size is too big"
                                                })
                                            }

                                        }
                                    }
                                    if (req.files.image2 !== undefined) {
                                        const image2 = req.files.image2;
                                        if (image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png") {
                                            if (image2.size < (4 * 1024 * 1024)) {
                                                let image2path;
                                                await cloudinary.uploader.upload(image2.tempFilePath, (err, result) => {
                                                    if (err) {
                                                        return res.json({
                                                            code: "1007",
                                                            message: err,
                                                        })
                                                    } else {
                                                        image2path = result.url
                                                    }
                                                })
                                                post.Image.push({ id: 2, url: image2path })
                                            } else {
                                                return res.json({
                                                    code: "1006",
                                                    message: "Image size is too big"
                                                })
                                            }

                                        }
                                    }
                                    if (req.files.image3 !== undefined) {
                                        const image3 = req.files.image3;
                                        if (image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png") {
                                            if (image3.size < (4 * 1024 * 1024)) {
                                                let image3path;
                                                await cloudinary.uploader.upload(image3.tempFilePath, (err, result) => {
                                                    if (err) {
                                                        return res.json({
                                                            code: "1007",
                                                            message: err,
                                                        })
                                                    } else {
                                                        image3path = result.url
                                                    }
                                                })
                                                post.Image.push({ id: 3, url: image3path })

                                            } else {
                                                return res.json({
                                                    code: "1006",
                                                    message: "Image size is too big"
                                                })
                                            }

                                        }
                                    }
                                    if (req.files.image4 !== undefined) {
                                        const image4 = req.files.image4;
                                        if (image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png") {
                                            if (image4.size < (4 * 1024 * 1024)) {
                                                let image4path;
                                                await cloudinary.uploader.upload(image4.tempFilePath, (err, result) => {
                                                    if (err) {
                                                        return res.json({
                                                            code: "1007",
                                                            message: err,
                                                        })
                                                    } else {
                                                        image4path = result.url
                                                    }
                                                })
                                                post.Image.push({ id: 4, url: image4path })

                                            } else {
                                                return res.json({
                                                    code: "1006",
                                                    message: "Image size is too big"
                                                })
                                            }

                                        }
                                    }
                                }
                            }
                            post.User_id = user._id
                            post.Described = described
                            post.Status = status
                            post.CreatedAt = Date.now()
                            post.save();

                            return res.json({
                                code: "1000",
                                message: "OK",
                                data: post
                            });

                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})

router.post("/add_post2/", (req, res) => {
    const token = req.query.token;
    const described = req.query.described;
    const status = req.query.status
    try {
        if (token) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004s",
                        message: "Parameter value is invalid token"
                    });
                } else {
                    const id = userData.user.id
                    let user = await User.findOne({ _id: id })
                    if (user) {
                        if (token === user.token) {
                            let post = new Post();

                            post.Image = [...req.body];
                            post.User_id = user._id
                            post.Described = described
                            post.Status = status
                            post.CreatedAt = Date.now()
                            post.save();
                            return res.json({
                                code: "1000",
                                message: "OK",
                                data: post
                            });
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }
                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }
})

router.post("/get_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    try {
        if (token && id) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004",
                        message: "Parameter value is invalid"
                    });
                } else {

                    let user = await User.findOne({ _id: userData.user.id })
                    if (user) {
                        if (token === user.token) {
                            let post = await Post.findOne({ _id: id })
                            if (post) {
                                let data = {}
                                data.id = post._id
                                data.described = post.Described
                                data.status = post.Status
                                data.created = post.CreatedAt
                                data.modified = post.UpdatedAt
                                data.like = post.Like.length
                                data.comment = post.Comment.length
                                if (post.Like.find(element => element == user._id)) {
                                    data.is_liked = 1;
                                } else {
                                    data.is_liked = 0;
                                }
                                data.image = post.Image
                                data.video = post.Video
                                if (user._id = post.User_id) {
                                    data.can_edit = 1;
                                } else {
                                    data.can_edit = 0;
                                }
                                let user1 = await User.findOne({ _id: post.User_id })
                                if (user1) {
                                    data.author = {
                                        id: user1._id,
                                        name: user1.phonenumber,
                                        avatar: user1.avatar,
                                    }
                                    if (user1.locked) {
                                        data.can_comment = 0
                                    } else {
                                        data.can_comment = 1
                                    }
                                }
                                return res.json({
                                    code: "1000",
                                    message: "ok",
                                    data: data
                                })

                            } else {
                                return res.json({
                                    code: "9992",
                                    message: "Don't find post by id"
                                })
                            }
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})


router.post("/delete_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    try {
        if (token && id) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004",
                        message: "Parameter value is invalid"
                    });
                } else {

                    let user = await User.findOne({ _id: userData.user.id })
                    if (user) {
                        if (token === user.token) {
                            let post = await Post.findOne({ _id: id })
                            if (post) {
                                if (user._id == post.User_id) {
                                    if (user.locked == 1) {
                                        return res.json({
                                            code: "9995",
                                            message: "User is locked"
                                        })
                                    } else {
                                        await Post.findOneAndDelete({ _id: id }, (err, data) => {
                                            if (err) {
                                                return res.json({
                                                    code: "1001",
                                                    message: "Can not connect database"
                                                })
                                            } else {
                                                return res.json({
                                                    code: "1000",
                                                    message: "OK",
                                                    data: data
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "This post is not of the user"
                                    })
                                }


                            } else {
                                return res.json({
                                    code: "9992",
                                    message: "Don't find post by id"
                                })
                            }
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})


router.post("/report_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    const subject = req.query.subject;
    const details = req.query.details
    try {
        if (token && id) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004",
                        message: "Parameter value is invalid"
                    });
                } else {

                    let user = await User.findOne({ _id: userData.user.id })
                    if (user) {
                        if (token === user.token) {
                            let post = await Post.findOne({ _id: id })
                            if (post) {
                                if (user.locked == 1) {
                                    return res.json({
                                        code: "9995",
                                        message: "User is locked"
                                    })
                                } else {
                                    let report = new Report()
                                    report.Subject = subject
                                    report.Details = details
                                    report.User_id = user._id
                                    report.Post_id = post._id
                                    report.ReportedAt = Date.now()
                                    report.save()
                                    post.Report.push(report._id)
                                    post.save()
                                    return res.json({
                                        code: "1000",
                                        message: "OK",
                                        data: report
                                    })
                                }
                            } else {
                                return res.json({
                                    code: "9992",
                                    message: "Don't find post by id"
                                })
                            }
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})


router.post("/edit_post/", (req, res) => {
    const id = req.query.id;
    const token = req.query.token;
    const described = req.query.described;
    const status = req.query.status
    try {
        if (token && id) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004",
                        message: "Parameter value is invalid"
                    });
                } else {

                    let user = await User.findOne({ _id: userData.user.id })
                    if (user) {
                        if (token === user.token) {
                            let post = await Post.findOne({ _id: id })
                            post.Image = [];
                            post.Video = [];
                            if (post) {
                                if (user._id == post.User_id) {
                                    if (user.locked == 1) {
                                        return res.json({
                                            code: "9995",
                                            message: "User is locked"
                                        })
                                    } else {
                                        post.Described = described
                                        post.Status = status
                                        if (req.files !== undefined) {
                                            if (req.files.video !== undefined && req.files.imagethumb !== undefined) {
                                                const video = req.files.video;
                                                const imagethumb = req.files.imagethumb;
                                                if (video.mimetype == "video/mp4" && (imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png")) {
                                                    if (video.size < (10 * 1024 * 1024)) {
                                                        let videopath;
                                                        let paththumb;
                                                        await cloudinary.uploader.upload(video.tempFilePath, { resource_type: "video" }, (err, result) => {
                                                            if (err) {
                                                                return res.json({
                                                                    code: "1007",
                                                                    message: err,
                                                                })
                                                            } else {
                                                                videopath = result.url
                                                            }
                                                        })
                                                        if (imagethumb.size < 4 * 1024 * 1024) {
                                                            await cloudinary.uploader.upload(imagethumb.tempFilePath, (err, result) => {
                                                                if (err) {
                                                                    return res.json({
                                                                        code: "1007",
                                                                        message: err,
                                                                    })
                                                                } else {
                                                                    paththumb = result.url
                                                                }
                                                            })
                                                            post.Video[0] = { url: videopath, thumb: paththumb }
                                                        }
                                                        post.Image = [];
                                                    } else {
                                                        return res.json({
                                                            code: "1006",
                                                            message: "Video size is too big"
                                                        })
                                                    }
                                                }
                                            } else {
                                                if (req.files.image1 !== undefined) {
                                                    const image1 = req.files.image1;
                                                    if (image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image2/png") {
                                                        if (image1.size < (4 * 1024 * 1024)) {
                                                            let image1path;
                                                            await cloudinary.uploader.upload(image1.tempFilePath, (err, result) => {
                                                                if (err) {
                                                                    return res.json({
                                                                        code: "1007",
                                                                        message: err,
                                                                    })
                                                                } else {
                                                                    image1path = result.url
                                                                }
                                                            })

                                                            post.Image[0] = { id: 1, url: image1path }
                                                        } else {
                                                            return res.json({
                                                                code: "1006",
                                                                message: "Image1 size is too big"
                                                            })
                                                        }
                                                        post.Video = []
                                                    }
                                                }
                                                if (req.files.image2 !== undefined) {
                                                    const image2 = req.files.image2;
                                                    if (image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png") {
                                                        if (image2.size < (4 * 1024 * 1024)) {
                                                            let image2path;
                                                            await cloudinary.uploader.upload(image2.tempFilePath, (err, result) => {
                                                                if (err) {
                                                                    return res.json({
                                                                        code: "1007",
                                                                        message: err,
                                                                    })
                                                                } else {
                                                                    image2path = result.url
                                                                }
                                                            })
                                                            post.Image[1] = { id: 2, url: image2path }

                                                        } else {
                                                            return res.json({
                                                                code: "1006",
                                                                message: "Image size is too big"
                                                            })
                                                        }
                                                        post.Video = []
                                                    }
                                                }
                                                if (req.files.image3 !== undefined) {
                                                    const image3 = req.files.image3;
                                                    if (image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png") {
                                                        if (image3.size < (4 * 1024 * 1024)) {
                                                            let image3path;
                                                            await cloudinary.uploader.upload(image3.tempFilePath, (err, result) => {
                                                                if (err) {
                                                                    return res.json({
                                                                        code: "1007",
                                                                        message: err,
                                                                    })
                                                                } else {
                                                                    image3path = result.url
                                                                }
                                                            })
                                                            post.Image[2] = { id: 3, url: image3path }

                                                        } else {
                                                            return res.json({
                                                                code: "1006",
                                                                message: "Image size is too big"
                                                            })
                                                        }
                                                        post.Video = []
                                                    }
                                                }
                                                if (req.files.image4 !== undefined) {
                                                    const image4 = req.files.image4;
                                                    if (image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png") {
                                                        if (image4.size < (4 * 1024 * 1024)) {
                                                            let image4path;
                                                            await cloudinary.uploader.upload(image4.tempFilePath, (err, result) => {
                                                                if (err) {
                                                                    return res.json({
                                                                        code: "1007",
                                                                        message: err,
                                                                    })
                                                                } else {
                                                                    image4path = result.url
                                                                }
                                                            })
                                                            post.Image[3] = { id: 4, url: image4path }

                                                        } else {
                                                            return res.json({
                                                                code: "1006",
                                                                message: "Image size is too big"
                                                            })
                                                        }
                                                        post.Video = []
                                                    }
                                                }
                                            }
                                        }
                                        post.UpdatedAt = Date.now()
                                        post.markModified('Image');
                                        post.markModified('Video');
                                        post.save().then(console.log)

                                        return res.json({
                                            code: "1000",
                                            message: "OK",
                                            data: post
                                        })
                                    }
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "This post is not of the user"
                                    })
                                }


                            } else {
                                return res.json({
                                    code: "9992",
                                    message: "Don't find post by id"
                                })
                            }
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})
//like
router.post("/like", async (req, res) => {
    const { token, id } = req.query;
    try {
        //Check if params are missing
        if (Object.keys(req.query).length < 2 || !token || !id) {
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
                //Add like to post
                try {
                    let post = await Post.findOne({ _id: id });
                    if (post.Like.includes(user.id)) {
                        post = await Post.findOneAndUpdate({ _id: id }, { $pull: { Like: user.id } }, { new: true });
                    } else {
                        post = await Post.findOneAndUpdate({ _id: id }, { $push: { Like: user.id } }, { new: true });

                        //send push notification
                        const deviceToken = await getUserDeviceToken(post.User_id);
                        newLikeNotification(deviceToken, user.phonenumber, id)
                    }
                    return res.json({
                        message: 'OK',
                        code: "1000",
                        data: {
                            like: post.Like.length
                        }
                    });
                } catch (error) {
                    return res.json({
                        message: error,
                        code: "1005",
                    });
                }
            }
        });
    } catch (error) {
        return res.json({
            message: "Server error",
            code: "1001",
        });
    }
});

//get listt post

// route.post("/get_list_post/")
router.post("/get_list_post/", (req, res) => {
    console.log('right on')
    const token = req.query.token;
    const last_id = req.query.last_id;
    const index = req.query.index;
    const count = req.query.count;
    try {
        if (token) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "1004s",
                        message: "Parameter value is invalid token"
                    });
                } else {
                    const id = userData.user.id
                    let user = await User.findOne({ _id: id })
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked",
                                });
                            }
                            let array_post = user.ListFriends;
                            await Promise.all(user.ListFriends.map(async id_1 => {
                                let user_1 = await User.findOne({ _id: id_1 });
                                array_post = array_post.concat(user_1.ListFriends);
                            }));
                            array_post = array_post.filter((item, post) => array_post.indexOf(item) === post)

                            // const index_1 = array_post.indexOf(user._id);
                            // if (index_1 > -1) {
                            //     array_post.splice(index_1, 1);
                            // }

                            let post = await Post.find({
                                User_id: { $in: array_post }
                            }).sort({ CreatedAt: 1 })

                            let last_post = -1;
                            if (last_id) {
                                last_post = post.findIndex(p => p._id == last_id)
                            }
                            let count_1 = 20;
                            if (count) {
                                count_1 = count
                            }
                            let post_slice = post.splice(last_post + 1, count_1)
                            // let post_slice = Post.paginate(post,{limit:count_1});
                            let posts = await Promise.all(post_slice.map(async post => {
                                let r_post = {}
                                r_post.id = post._id
                                r_post.described = post.Described
                                r_post.status = post.Status
                                r_post.created = post.CreatedAt.toUTCString()
                                r_post.modified = post.UpdatedAt
                                r_post.like = post.Like.length
                                r_post.comment = post.Comment.length
                                if (post.Like.find(element => element == user._id)) {
                                    r_post.is_liked = 1;
                                } else {
                                    r_post.is_liked = 0;
                                }
                                r_post.image = post.Image
                                r_post.video = post.Video
                                if (user._id = post.User_id) {
                                    r_post.can_edit = 1;
                                } else {
                                    r_post.can_edit = 0;
                                }
                                let user1 = await User.findOne({ _id: post.User_id })
                                if (user1) {
                                    r_post.author = {
                                        id: user1._id,
                                        name: user1.phonenumber,
                                        avatar: user1.avatar,
                                    }
                                    if (user1.locked) {
                                        r_post.can_comment = 0
                                    } else {
                                        r_post.can_comment = 1
                                    }
                                }
                                return r_post;
                            }));
                            const l = post_slice.length;
                            // let last_id_1 = post_slice[l - 1]._id
                            let data = {};
                            data.post = posts;
                            // data.last_id = last_id_1
                            return res.json({
                                code: "1000",
                                message: "Ok",
                                data: data,
                            })
                        } else {
                            if (user.token === "" || user.token === null) {
                                return res.json({
                                    code: "1004",
                                    message: "User don't have token in db"
                                })
                            } else {
                                return res.json({
                                    code: "1004",
                                    message: "Token is invalid"
                                })
                            }

                        }
                    } else {
                        return res.json({
                            code: "9995",
                            message: "Don't find user by token"
                        })
                    }
                }
            });
        } else {
            return res.json(
                {
                    code: "1002",
                    message: "No have Token"
                }
            )
        }
    } catch (error) {
        return res.json({
            code: "1005",
            message: error
        })
    }

})


module.exports = router;
