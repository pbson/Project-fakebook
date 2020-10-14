const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const User = require("../../models/User");


router.post('/get_list_conversation',async (req,res)=>{
    const token = req.query.token;
    try {
      if (token) {
          jwt.verify(token, "secretToken", async (err, userData) => {
              if (err) {
                  res.json({
                      code: "1004",
                      message: "Parameter value is invalid"
                  });
              } else {

                  const id = userData.user.id
                  let user = await User.findOne({ _id: id })
                  if (user) {
                      if (token === user.token) {
                        let resarray=[];
                        let count = 0;
                        let arrayConversation =  await Conversation.find({"UserList.id":id});
                        arrayConversation.forEach(async conversation => {
                            let object = {};
                            object.id=conversation._id;
                            const userlist = conversation.UserList;
                            let idpartner = userlist[0].id==id?userlist[1].id:userlist[0].id 
                            let partner = await User.findOne({_id:idpartner})
                            object.Partner={
                                id : partner._id,
                                avatar : partner.avatar
                            }
                            const messagelist = conversation.MessageList

                            const idlastmess = messagelist.pop().id;
                            let lastmess = await Message.findOne({_id:idlastmess});
                            object.LastMessage={
                                message : lastmess.Content,
                                created : lastmess.CreatedAt,
                                unread : lastmess.Unread
                            }
                            if(lastmess.Unread==1){
                                count = count +1
                            }
                            console.log(object)
                            resarray.push(object);
                            count = count +1;
                            console.log(count)
                        });
                        
                        return res.json({
                            code : "1000",
                            message : "OK",
                            data : resarray,
                            numberNewMessage:count
                        })
                      } else {
                          if (user.token === "" || user.token === null) {
                              return res.json({
                                  code: "1004",
                                  message: "User not logged in"
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

router.post('/a',async (req,res)=>{
    let a = await Message.find({})
    return res.json(a);
})
router.post('/b',async (req,res)=>{
    const id = req.query.id
    const id1 = req.query.id1
    let a =await  Conversation.findOne({_id:id1})
    a.MessageList.push({id : id})
    a.save()
    return res.json(a)
})
router.post('/set_read_message',(req,res)=>{
    const token = req.query.token
    const partner_id= req.query.partner_id
    const conversation_id=req.query.conversation_id
    try {
        if ((token && partner_id)||(token&&conversation_id)) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "9998",
                        message: "Token is invalid"
                    });
                } else {
                    const id = userData.user.id;
                    let user = await User.findOne({ _id: id }) 
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked"
                                })
                        }else {
                            if(conversation_id){
                                let conversation = await Conversation.findOne({_id:conversation_id})
                                if(conversation){
                                    // if(conversation.UserList[0].id!==id&&conversation.UserList[1].id!==id){
                                    //     return res.json({
                                    //         code: "1004",
                                    //         message: "Conversation "
                                    //     }) 
                                    // }
                                    return res.json({
                                        code: "1000",
                                        message: "OK",
                                        
                                    })
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "Conversation Not Found"
                                    }) 
                                }
                            } else if(partner_id) {
                                let conversation = await Conversation.findOne({"UserList.id":id,"UserList.id":partner_id})
                                if(conversation){
                                    return res.json({
                                        code: "1000",
                                        message: "OK",
                                        
                                    })
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "Conversation Not Found"
                                    }) 
                                }
                            }

                        }
                    } else {
                            if (user.Token === "" || user.Token === null) {
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
            return res.json({
                code: "1002",
                message: "Missing token or partner_id or conversation_id "
    
            })
        } 
    } catch (error) {
        return res.json({
            code:"1005",
            message : error
        })
    }
})


router.post('/delete_conversation',(req,res)=>{
    const token = req.query.token
    const partner_id= req.query.partner_id
    const conversation_id=req.query.conversation_id
    try {
        if ((token && partner_id)||(token&&conversation_id)) {
            jwt.verify(token, "secretToken", async (err, userData) => {
                if (err) {
                    res.json({
                        code: "9998",
                        message: "Token is invalid"
                    });
                } else {
                    const id = userData.user.id;
                    let user = await User.findOne({ _id: id }) 
                    if (user) {
                        if (token === user.token) {
                            if (user.locked == 1) {
                                return res.json({
                                    code: "9995",
                                    message: "You are  locked"
                                })
                        }else {
                            if(conversation_id){
                                let conversation = await Conversation.findOne({_id:conversation_id})
                                if(conversation){
                                    let messagelist = conversation.MessageList;
                                    messagelist.forEach(async message => {
                                        await Message.findOneAndDelete({_id:message.id})
                                    });
                                    await Conversation.findOneAndDelete({_id:conversation._id})
                                    return res.json({
                                        code: "1000",
                                        message: "OK",
                                        
                                    })
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "Conversation Not Found"
                                    }) 
                                }
                            } else if(partner_id) {
                                let conversation = await Conversation.findOne({"UserList.id":id,"UserList.id":partner_id})
                                if(conversation){
                                    let messagelist = conversation.MessageList;
                                    messagelist.forEach(async message => {
                                        await Message.findOneAndDelete({_id:message.id})
                                    });
                                    await Conversation.findOneAndDelete({_id:conversation._id})
                                    return res.json({
                                        code: "1000",
                                        message: "OK",
                                        
                                    })
                                } else {
                                    return res.json({
                                        code: "1004",
                                        message: "Conversation Not Found"
                                    }) 
                                }
                            }

                        }
                    } else {
                            if (user.Token === "" || user.Token === null) {
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
            return res.json({
                code: "1002",
                message: "Missing token or partner_id or conversation_id "
    
            })
        } 
    } catch (error) {
        return res.json({
            code:"1005",
            message : error
        })
    }
})


module.exports = router;