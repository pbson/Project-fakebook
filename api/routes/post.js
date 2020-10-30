const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const User = require("../../models/User");
const Post = require("../../models/Post");
const Report = require("../../models/Report");

const server = require("../../server");

router.post("/add_post/", (req, res) => {
    const path = server.path
    
    const token = req.query.token;
    const image1 = req.files.image1;
    const image2 = req.files.image2;
    const image3 = req.files.image3;
    const image4 = req.files.image4;
    const imagethumb = req.files.imagethumb
    const video = req.files.video;
    // const video2 = req.files.video2;
    // const video3 = req.files.video3;
    // const video4 = req.files.video4;
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

                            if(video&&imagethumb){
                                
                                if(video.mimetype == "video/mp4"&&(imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png")){
                                    if(video.size<(10*1024*1024)){
                                        const videopath = path + '/public/post/video/'+user._id+Date.now()+video.name;
                                        console.log(path) 
                                        await video.mv(videopath,function(err){
                                            if(err){
                                                return res.json({
                                                    code : "1007",
                                                    message : err
                                                })
                                            } else {
                                            }
                                        })
                                        if(imagethumb.size<4*1024*1024){
                                            let paththumb = path + '/public/post/image/'+user._id+Date.now() + imagethumb.name;
                                            await imagethumb.mv(paththumb,function(err){
                                                if(err){
                                                    return res.json({
                                                        code : "1007",
                                                        message : err
                                                    })
                                                }    
                                            })
                                            post.Video.push({url : videopath,thumb : paththumb });
                                        }
                                    } else {
                                        return res.json({
                                            code : "1006",
                                            message : "Video size is too big"
                                        })
                                    }
                                } 
                            } else {
                                if(image1){
                                    if(image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image2/png"){
                                        if(image1.size<(4*1024*1024)){
                                            const image1path = path + '/public/post/image1/'+user._id+Date.now()+image1.name;
                                            
                                            image1.mv(image1path,function(err){
                                                if(err){
                                                    return res.json({
                                                        code : "1007",
                                                        message : err
                                                    })
                                                }else {
                                                }
                                            })
    
                                            post.Image.push({id : 1 , url : image1path})
                                        } else {
                                            return res.json({
                                                code : "1006",
                                                message : "Image1 size is too big"
                                            })
                                        }
        
                                    }
                                }
                                if(image2){
                                    if(image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png"){
                                        if(image2.size<(4*1024*1024)){
                                            const image2path = path + '/public/post/image/'+user._id+Date.now()+image2.name;
                                            
                                            image2.mv(image2path,function(err){
                                                if(err){
                                                    return res.json({
                                                        code : "1007",
                                                        message : err
                                                    })
                                                }else {
                                                }
                                            })
                                            post.Image.push({id : 2 , url : image2path})
                                        } else {
                                            return res.json({
                                                code : "1006",
                                                message : "Image size is too big"
                                            })
                                        }
        
                                    }
                                }
                                if(image3){
                                    if(image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png"){
                                        if(image3.size<(4*1024*1024)){
                                            const image3path = path + '/public/post/image/'+user._id+Date.now()+image3.name;
                                            
                                            image3.mv(image3path,function(err){
                                                if(err){
                                                    return res.json({
                                                        code : "1007",
                                                        message : err
                                                    })
                                                }else {
                                                }
                                            })
                                            post.Image.push({id : 3 , url : image3path})
    
                                        } else {
                                            return res.json({
                                                code : "1006",
                                                message : "Image size is too big"
                                            })
                                        }
        
                                    }
                                }
                                if(image4){
                                    if(image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png"){
                                        if(image4.size<(4*1024*1024)){
                                            const image4path = path + '/public/post/image/'+user._id+Date.now()+image4.name;
                                            
                                            image4.mv(image4path,function(err){
                                                if(err){
                                                    return res.json({
                                                        code : "1007",
                                                        message : err
                                                    })
                                                }else {
                                                }
                                            })
                                            post.Image.push({id : 4 , url : image4path})
    
                                        } else {
                                            return res.json({
                                                code : "1006",
                                                message : "Image size is too big"
                                            })
                                        }
        
                                    }
                                }
                            }
                            // if(video2){
                                
                            //     if(video2.mimetype == "video/mp4"){
                            //         if(video2.size<(10*1024*1024)){
                            //             const video2path = path + '/public/post/video/'+user._id+Date.now()+video2.name;
                                         
                            //             await video2.mv(video2path,function(err){
                            //                 if(err){
                            //                     return res.json({
                            //                         code : "1007",
                            //                         message : err
                            //                     })
                            //                 } else {

                            //                 }
                            //             })
                            //             post.Video.push(video2path);
                            //         } else {
                            //             return res.json({
                            //                 code : "1006",
                            //                 message : "Video size is too big"
                            //             })
                            //         }
                            //     }
                            // }
                            // if(video3){
                                
                            //     if(video3.mimetype == "video/mp4"){
                                    
                            //         if(video3.size<(10*1024*1024)){
                            //             const video3path = path + '/public/post/video/'+user._id+Date.now()+video3.name;
                                        
                            //             await video3.mv(video3path,function(err){
                            //                 if(err){
                            //                     return res.json({
                            //                         code : "1007",
                            //                         message : err
                            //                     })
                            //                 } else {
                                                

                            //                 }
                            //             })
                            //             post.Video.push(video3path);
                            //         } else {
                            //             return res.json({
                            //                 code : "1006",
                            //                 message : "Video size is too big"
                            //             })
                            //         }
                            //     }
                            // }
                            // if(video4){
                                
                            //     if(video4.mimetype == "video/mp4"){
                                
                            //         if(video4.size<(10*1024*1024)){
                            //             const video4path = path + '/public/post/video/'+user._id+Date.now()+video4.name;
                                         
                            //             await video4.mv(video4path,function(err){
                            //                 if(err){
                            //                     return res.json({
                            //                         code : "1007",
                            //                         message : err
                            //                     })
                            //                 } else {
                                                

                            //                 }
                            //             })
                            //             post.Video.push(video4path);
                            //         } else {
                            //             return res.json({
                            //                 code : "1006",
                            //                 message : "Video size is too big"
                            //             })
                            //         }
                            //     }
                            // }
                            console.log(post)
                            post.User_id = user._id
                            post.Described= described
                            post.Status=status
                            post.CreatedAt = Date.now()
                            post.save();
                        
                            return res.json({
                                        code: "1000",
                                        message: "OK",
                                        data : post
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
            code : "1005",
            message : error
        })
    }
  
  })


  router.post("/get_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    try {
        if (token&&id) {
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
                             if(post){
                                let data = {}
                                data.id= post._id
                                data.described = post.Described
                                data.status = post.Status
                                data.created = post.CreatedAt
                                data.modified = post.UpdatedAt
                                data.like = post.Like.length
                                data.comment = post.Comment.length
                                if(post.Like.find(element => element == user._id)) {
                                    data.is_liked = 1;
                                } else {
                                    data.is_liked = 0;
                                }
                                data.image = post.Image
                                data.video = post.Video
                                if(user._id=post.User_id){
                                    data.can_edit = 1 ;
                                } else {
                                    data.can_edit = 0 ;
                                }
                                let user1 = await User.findOne({ _id: post.User_id })
                                if(user1){
                                    data.author = {
                                        id : user1._id,
                                        name : user1.phonenumber,
                                        avatar : user1.avatar,
                                    }
                                    if(user1.locked){
                                        data.can_comment = 0
                                    } else {
                                        data.can_comment = 1
                                    }
                                }
                                return res.json({
                                    code : "1000",
                                    message : "ok",
                                    data : data
                                })

                             } else{
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
            code : "1005",
            message : error
        })
    }
  
  })
  // set request friend 
  
  router.post("/delete_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    try {
        if (token&&id) {
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
                             if(post){
                                if(user._id==post.User_id){
                                    if(user.locked==1){
                                        return res.json({
                                            code : "9995",
                                            message : "User is locked"
                                        })
                                    } else {
                                        await Post.findOneAndDelete({_id : id},(err,data)=>{
                                            if(err){
                                                return res.json({
                                                    code : "1001",
                                                    message : "Can not connect database"
                                                })
                                            } else {
                                                return res.json({
                                                    code : "1000",
                                                    message : "OK",
                                                    data:data
                                                })
                                            }
                                        })
                                    }
                                } else {
                                    return res.json({
                                        code : "1004",
                                        message : "This post is not of the user"
                                    })
                                }
 

                             } else{
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
            code : "1005",
            message : error
        })
    }
  
  })
  // set request friend 
  
  router.post("/report_post/", (req, res) => {
    const token = req.query.token;
    const id = req.query.id;
    const subject = req.query.subject;
    const details = req.query.details
    try {
        if (token&&id) {
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
                             if(post){
                                    if(user.locked==1){
                                        return res.json({
                                            code : "9995",
                                            message : "User is locked"
                                        })
                                    } else {
                                        let report = new Report()
                                        report.Subject = subject
                                        report.Details = details
                                        report.User_id=user._id
                                        report.Post_id = post._id
                                        report.ReportedAt = Date.now()
                                        report.save()
                                        post.Report.push(report._id)
                                        post.save()
                                        return res.json({
                                            code : "1000",
                                            message : "OK",
                                            data : report
                                        })
                                    }
                             } else{
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
            code : "1005",
            message : error
        })
    }
  
  })
  // set request friend 

  router.post("/edit_post/", (req, res) => {
    const path = server.path

    const id = req.query.id;
    const token = req.query.token;
    const image_del = req.body.image_del
    const image1 = req.files.image1;
    const image2 = req.files.image2;
    const image3 = req.files.image3;
    const image4 = req.files.image4;
    const imagethumb = req.files.imagethumb
    const video = req.files.video;
    // const video2 = req.files.video2;
    // const video3 = req.files.video3;
    // const video4 = req.files.video4;
    const described = req.query.described;
    const status = req.query.status
    try {
        if (token&&id) {
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
                             if(post){
                                if(user._id==post.User_id){
                                    if(user.locked==1){
                                        return res.json({
                                            code : "9995",
                                            message : "User is locked"
                                        })
                                    } else {
                                        //
                                        post.Described= described
                                        post.Status = status
                                        
                                        if(image_del){
                                            image_del.forEach(e => {
                                                post.Image.forEach((element,index) => {
                                                    if(element.id==e){
                                                        post.Image.splice(element,1)
                                                    }
                                                });
                                            });
                                        }
                                        if(video&&imagethumb){
                                            if(post.Image.length==0){
                                                if(video.mimetype == "video/mp4"&&(imagethumb.mimetype === "image/jpeg" || imagethumb.mimetype === "image/jpg" || imagethumb.mimetype === "image/png")){
                                                    if(video.size<(10*1024*1024)){
                                                        const videopath = path + '/public/post/video/'+user._id+Date.now()+video.name;
                                                        console.log(path) 
                                                        await video.mv(videopath,function(err){
                                                            if(err){
                                                                return res.json({
                                                                    code : "1007",
                                                                    message : err
                                                                })
                                                            } else {
                                                            }
                                                        })
                                                        if(imagethumb.size<4*1024*1024){
                                                            let paththumb = path + '/public/post/image/'+user._id+Date.now() + imagethumb.name;
                                                            await imagethumb.mv(paththumb,function(err){
                                                                if(err){
                                                                    return res.json({
                                                                        code : "1007",
                                                                        message : err
                                                                    })
                                                                }    
                                                            })
                                                            post.Video.push({url : videopath,thumb : paththumb });
                                                        }
                                                    } else {
                                                        return res.json({
                                                            code : "1006",
                                                            message : "Video size is too big"
                                                        })
                                                    }
                                                }
                                            } else {
                                                return res.json({
                                                    code : "1004",
                                                    message : "This post have image"
                                                })
                                            }

                                        } else {
                                            if(image1){
                                                if(image1.mimetype === "image/jpeg" || image1.mimetype === "image/jpg" || image1.mimetype === "image2/png"){
                                                    if(image1.size<(4*1024*1024)){
                                                        const image1path = path + '/public/post/image1/'+user._id+Date.now()+image1.name;
                                                        
                                                        image1.mv(image1path,function(err){
                                                            if(err){
                                                                return res.json({
                                                                    code : "1007",
                                                                    message : err
                                                                })
                                                            }else {
                                                            }
                                                        })
                
                                                        post.Image.push({id : 1 , url : image1path})
                                                    } else {
                                                        return res.json({
                                                            code : "1006",
                                                            message : "Image1 size is too big"
                                                        })
                                                    }
                    
                                                }
                                            }
                                            if(image2){
                                                if(image2.mimetype === "image/jpeg" || image2.mimetype === "image/jpg" || image2.mimetype === "image/png"){
                                                    if(image2.size<(4*1024*1024)){
                                                        const image2path = path + '/public/post/image/'+user._id+Date.now()+image2.name;
                                                        
                                                        image2.mv(image2path,function(err){
                                                            if(err){
                                                                return res.json({
                                                                    code : "1007",
                                                                    message : err
                                                                })
                                                            }else {
                                                            }
                                                        })
                                                        post.Image.push({id : 2 , url : image2path})
                                                    } else {
                                                        return res.json({
                                                            code : "1006",
                                                            message : "Image size is too big"
                                                        })
                                                    }
                    
                                                }
                                            }
                                            if(image3){
                                                if(image3.mimetype === "image/jpeg" || image3.mimetype === "image/jpg" || image3.mimetype === "image/png"){
                                                    if(image3.size<(4*1024*1024)){
                                                        const image3path = path + '/public/post/image/'+user._id+Date.now()+image3.name;
                                                        
                                                        image3.mv(image3path,function(err){
                                                            if(err){
                                                                return res.json({
                                                                    code : "1007",
                                                                    message : err
                                                                })
                                                            }else {
                                                            }
                                                        })
                                                        post.Image.push({id : 3 , url : image3path})
                
                                                    } else {
                                                        return res.json({
                                                            code : "1006",
                                                            message : "Image size is too big"
                                                        })
                                                    }
                    
                                                }
                                            }
                                            if(image4){
                                                if(image4.mimetype === "image/jpeg" || image4.mimetype === "image/jpg" || image4.mimetype === "image/png"){
                                                    if(image4.size<(4*1024*1024)){
                                                        const image4path = path + '/public/post/image/'+user._id+Date.now()+image4.name;
                                                        
                                                        image4.mv(image4path,function(err){
                                                            if(err){
                                                                return res.json({
                                                                    code : "1007",
                                                                    message : err
                                                                })
                                                            }else {
                                                            }
                                                        })
                                                        post.Image.push({id : 4 , url : image4path})
                
                                                    } else {
                                                        return res.json({
                                                            code : "1006",
                                                            message : "Image size is too big"
                                                        })
                                                    }
                    
                                                }
                                            }
                                        }
                                        post.save()
                                        return res.json({
                                            code : "1000",
                                            message : "OK",
                                            data : post
                                        })
                                    }
                                } else {
                                    return res.json({
                                        code : "1004",
                                        message : "This post is not of the user"
                                    })
                                }
 

                             } else{
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
            code : "1005",
            message : error
        })
    }
  
  })
  // set request friend 
  

module.exports = router;
