const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const User = require("../../models/User");
const DeviceToken = require("../../models/DeviceToken");

router.post("/signup", async (req, res) => {
  const { phonenumber, password, uuid } = req.query;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  try {
    //Check if params are missing

    if (
      Object.keys(req.query).length !== 3 ||
      uuid.length <= 0 ||
      password.length <= 0 ||
      phonenumber.length <= 0
    ) {
      return res.json({
        message: "Missing field",
        code: "1002",
      });
    }
    //Check if phone number is vaild
    else if (!vnf_regex.test(phonenumber)) {
      return res.json({
        message: "Invalid phone number",
        code: "1003",
      });
    }
    //Check if password is vaild
    else if (
      password.length < 6 ||
      password.length > 10 ||
      password.trim() === phonenumber.trim()
    ) {
      return res.json({
        message: "Invalid password",
        code: "1003",
      });
    }
    //Check if user already exist
    let findUser = await User.find({ phonenumber: phonenumber });
    if (findUser.length > 0) {
      return res.json({
        message: "User existed",
        code: "9996",
      });
    }
    //Create user
    const salt = await bcrypt.genSalt(10);
    let saltPassword = await bcrypt.hash(password, salt);

    let user = new User({
      phonenumber: phonenumber,
      password: saltPassword,
      uuid: uuid,
      latestLoginTime: Date.now(),
      locked: "0",
      avatar: req.headers.host + '/it4788/uploads/image/19b64ad6ca7b090e6ab9a88bf5da42fb.png'
    });

    await user.save();

    // Create a new user
    const payload = {
      user: {
        id: user.id,
        password: user.password,
        latestLoginTime: user.latestLoginTime,
      },
    };

    jwt.sign(
      payload,
      "secretToken",
      { expiresIn: 360000 },
      async (err, token) => {
        if (err) throw err;

        await User.findOneAndUpdate({ _id: user.id }, { token: token });

        return res.json({
          message: " User created",
          code: 1000,
          token,
        });
      }
    );
  } catch (error) {
    res.send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { phonenumber, password, uuid } = req.query;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  try {
    //Check if params are missing
    if (
      Object.keys(req.query).length !== 3 ||
      uuid.length <= 0 ||
      password.length <= 0 ||
      phonenumber.length <= 0
    ) {
      return res.json({
        message: "Missing field",
        code: "1002",
      });
    }
    //Check if phone number is vaild
    else if (!vnf_regex.test(phonenumber)) {
      return res.json({
        message: "Invalid phone number",
        code: "1003",
      });
    }
    //Check if password is vaild
    else if (
      password.length < 6 ||
      password.length > 10 ||
      password.trim() === phonenumber.trim()
    ) {
      return res.json({
        message: "Invalid password",
        code: "1003",
      });
    }
    // Find user with request phone number
    let user = await User.findOne({ phonenumber: phonenumber });

    if (!user) {
      return res.json({
        message: "Invalid credential",
        code: "1003",
      });
    }
    // Check user password match or not
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        message: "Invalid credential",
        code: "1003",
      });
    }

    // Sign a token
    const payload = {
      user: {
        id: user.id,
        password: user.password,
        latestLoginTime: user.latestLoginTime,
      },
    };
    jwt.sign(
      payload,
      "secretToken",
      { expiresIn: 360000 },
      async (err, token) => {
        if (err) throw err;
        // Login and update user token
        let findUser = await User.findOneAndUpdate(
          { _id: user.id },
          { token: token, latestLoginTime: Date.now() }
        );
        if (!findUser) {
          return res.json({
            message: "Invalid credential",
            code: "9996",
          });
        } else {
          return res.json({
            message: "User logged in",
            code: "1000",
            data: {
              id: user.id,
              phonenumber: user.phonenumber,
              token: token,
              avatar: user.avatar
            },
          });
        }
      }
    );
  } catch (error) {
    res.send("Server error");
  }
});

router.post("/set_accept_friend", async (req, res) => {
  const { token, user_id, is_accept } = req.query;
  try {
    //Check if params are missing
    if (
      Object.keys(req.query).length !== 3 ||
      token.length <= 0 ||
      user_id.length <= 0 ||
      is_accept.length <= 0
    ) {
      return res.json({
        message: "Missing field",
        code: "1002",
      });
    }
    //Check if is_accept field is vaild
    else if (!["0", "1"].includes(is_accept)) {
      return res.json({
        message: "Invalid is_accept field",
        code: "1003",
      });
    }
    // Check if user_id field is vaild
    let requestFriend = await User.findOne({ _id: user_id });

    if (!requestFriend || requestFriend.locked == 1) {
      return res.json({
        message: "Request friend doesn't exist or locked",
        code: "9995",
      });
    }
    //Decode token to get id
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
        //Check if requested user is in user FriendRequest array
        if (!user.FriendsRequest.includes(user_id)) {
          return res.json({
            message: "Friend request is invalid",
            code: "9994",
          });
        }
        //Check if user is in requested user Req list
        if (!requestFriend.Req.includes(user.id)) {
          return res.json({
            message: "Friend request is invalid",
            code: "9994",
          });
        } else {
          //Move request to Friend List if friend request is accepted
          if (is_accept == 1) {
            await User.findOneAndUpdate(
              {
                _id: user.id,
              },
              {
                $pull: { FriendsRequest: mongoose.Types.ObjectId(user_id) },
                $push: { ListFriends: mongoose.Types.ObjectId(user_id) },
              }
            );

            await User.findOneAndUpdate(
              {
                _id: requestFriend.id,
              },
              {
                $pull: { Req: mongoose.Types.ObjectId(user.id) },
                $push: { ListFriends: mongoose.Types.ObjectId(user.id) },
              }
            );
            return res.json({
              message: "Friend request accepted",
              code: "1000",
            });
          //Remove request friend request isn't accepted
          } else if (is_accept == 0) {
            await User.findOneAndUpdate(
              {
                _id: user.id,
              },
              {
                $pull: { FriendsRequest: mongoose.Types.ObjectId(user_id) },
              }
            );

            await User.findOneAndUpdate(
              {
                _id: requestFriend.id,
              },
              {
                $pull: { Req: mongoose.Types.ObjectId(user.id) },
              }
            );
            return res.json({
              message: "Friend request denined",
              code: "1000",
            });
          }
        }
      }
    });
  } catch (error) {
    return res.json({
      message: 'Server error',
      code: "1001",
    });
  }
});

//Quang 
// logout 
router.post("/logout/", (req, res) => {
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
                          let a = await User.findOneAndUpdate({ _id: user._id }, { token: "" })
                          if (a) {
                              return res.json({
                                  code: "1000",
                                  message: "OK"
                              })
                          } else {
                              return res.json({
                                  code : "1001",
                                  message: "Can not connect Database"
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

router.post("/set_request_friend/", (req, res) => {
  const { token, user_id } = req.query;
  try {
      if (token && user_id) {
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
                              let a = await User.findOne({ _id: user_id })
                          if (a) {
                              if (user._id.toString() == a._id.toString()) {
                                  return res.json({
                                      code: "1003",
                                      message: "The recipient is the sender"
                                  })
                              } else {
                                  if (user.locked == 1) {
                                      return res.json({
                                          code: "9995",
                                          message: "You are  locked"
                                      })
                                  }else if (a.locked==1){
                                      return res.json({
                                          code: "9995",
                                          message: "User is locked"
                                      })
                                  } else {
                                      let l1 = user.ListFriends;
                                      let l2 = a.ListFriends;
                                      if(l1.includes(a._id)){
                                        return res.json({
                                          code : "1003",
                                          messeage : "You are already friends"
                                        })
                                      }
                                      let count = 0;
                                      for (let i = 0; i < l1.length; i++) {
                                          for (let j = 0; j < l2.length; j++) {
                                              if (l1[i] === l2[j]) {
                                                  count = count + 1;
                                              }
                                          }
                                      }
                                      if (l1.length > 3000) {
                                          return res.json({
                                              code: "9994",
                                              message: "Your friends list is full"
                                          })
                                      } else if (l2.length > 3000) {
                                          return res.json({
                                              code: "9994",
                                              message: "Their friends list is full"
                                          })
                                      }
                                      let ar1 = user.Req;
                                      let ar2 = a.FriendsRequest;
                                      let c1 = false
                                      let c2 = false
                                      for(let i = 0;i<ar1.length;i++){
                                          if(ar1[i].toString()==a._id.toString()){
                                              await user.Req.splice(i,1);
                                              user.save();
                                              c1=true
                                          }
                                      }
                                                                          
                                      for(let j = 0;j<ar2.length;j++){
                                          if(ar2[j].toString()==user._id.toString()){
                                              await a.FriendsRequest.splice(j,1);
                                              a.save();
                                              c2=true
                                          }
                                      }
                                      if(c1&&c2){
                                          return res.json({
                                              code :"1000",
                                              message : "Delete request friend",
                                              requets_friend : count
                                          })
                                      }
                                  //    let update1 = await User.FriendsRequest.update({ _id: "5f73771dcf7957a4e70b4f88" }, { $push: { "id": "5f73771dcf7957a4e70b4f88" } });
                                  //    let update2 = await User.Req.update({ _id: user._id }, { $push: { "id": a._id } });
                                      await user.Req.push(a._id);
                                      user.save()
                                      await a.FriendsRequest.push(user._id);
                                      a.save()
                                      return res.json({
                                          code: "1000",
                                          message: "OK",
                                          requets_friend: count
                                      })
                                  }
                              }
                          } else {
                              return res.json({
                                  code: "9995",
                                  message: "Don't have user to send request"
                              })
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
              message: "Missing token or userid "
  
          })
      } 
  } catch (error) {
      return res.json({
          code:"1005",
          message : error
      })
  }


})

//get user info
router.post("/get_user_info", (req,res) => {
  const { token, user_id } = req.query;
  try {
      //Decode token to get user_id
      jwt.verify(token, "secretToken", async (err, userData) => {
          if (err) {
              res.json({
                  message: "Token is invalid",
                  code: "9998",
              });
          } else {
              let user
              if (user_id){
                user = await User.findOne({ _id: user_id });
              }else{
                user = await User.findOne({ _id: userData.user.id });
              }
              //Search user with token provided
              if (!user) {
                  return res.json({
                      message: "Can't find user",
                      code: "9995",
                  });
              }
              //Check if user is locked
              if (user.locked == 1) {
                  return res.json({
                      message: "User is locked",
                      code: "9995",
                  });
              }
              let resData = {
                id: user._id,
                username: user.username,
                created: user.created,
                description: user.description,
                avatar:user.avatar,
                cover_image: user.cover_image,
                address: user.address,
                city: user.city,
                country: user.country,
                listing:user.listing,
                online: user.online
              } 
              return res.json({
                  code: "1000",
                  message: "ok",
                  data: resData
              })
          }

      });
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})

router.post("/set_user_info",(req,res) => {
  const { token, username, description, avatar, address, city, country, cover_image, link } = req.query;
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
              if (description.length > 150){
                return res.json({
                  code: "1000",
                  message: "Description too long",
                })
              }
              if (avatar.localeCompare('vnhackers.com')== true || cover_image.localeCompare('vnhackers.com')== true){
                return res.json({
                  code: "1000",
                  message: "url is prohibited",
                })
              }
              }
              let resData = {
                username: username,
                description: description,
                avatar:avatar,
                cover_image: cover_image,
                address: address,
                city: city,
                country: country,
                listing:listing,
              } 

              for (let prop in userData) if (!userData[prop]) delete userData[prop];
              let updateUser = await User.findOneAndUpdate({ _id: userData.user.id }, userData );

              return res.json({
                  code: "1000",
                  message: "ok",
                  data: resData
              })
          })
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})

router.post("/set_devtoken",(req,res) => {
  const { token, devtoken } = req.query;
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
              
              let updateUser = DeviceToken.findOneAndUpdate({UserId: user.id}, { DeviceToken:devtoken})

              return res.json({
                  code: "1000",
                  message: "ok",
                  data: {
                    userId: updateUser.id,
                    DeviceToken: updateUser.DeviceToken
                  }
              })
          }

      });
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})

router.post("/get_user_friends", (req,res) => {
  const { token,user_id,index,count } = req.query;
  try {
      //Decode token to get user_id
      jwt.verify(token, "secretToken", async (err, userData) => {
          if (err) {
              res.json({
                  message: "Token is invalid",
                  code: "9998",
              });
          } else {
              let user;
              if (user_id){
                user = await User.findOne({ _id: user_id });
              }else{
                user = await User.findOne({ _id: userData.user.id });
              }
              //Search user 
              if (!user) {
                  return res.json({
                      message: "Can't find user",
                      code: "9995",
                  });
              }
              //Check if user is locked
              if (user.locked == 1) {
                  return res.json({
                      message: "User is locked",
                      code: "9995",
                  });
              }
              requestData = await Promise.all(user.ListFriends.map(async friend => {
                let findFriend = await User.findOne({ _id: friend });
                let intersection = user.ListFriends.filter(element => findFriend.ListFriends.includes(element));
                return {
                  id: findFriend._id,
                  username: findFriend.username,
                  avatar: findFriend.avatar,
                  same_friends: intersection.length
                }
              }))
              requestData.sort(function(a, b) {
                var textA = a.username.toUpperCase();
                var textB = b.username.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
            
              let responseData = {
                friends: requestData.slice(index,index+count),
                total: user.ListFriends.length
              } 
              return res.json({
                  code: "1000",
                  message: "ok",
                  data: responseData
              })
          }

      });
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})

router.post("/get_requested_friends", (req,res) => {
  console.log('abc')
  const { token,index,count } = req.query;
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
              //Search user 
              if (!user) {
                  return res.json({
                      message: "Can't find user",
                      code: "9995",
                  });
              }
              //Check if user is locked
              if (user.locked == 1) {
                  return res.json({
                      message: "User is locked",
                      code: "9995",
                  });
              }
              requestData = await Promise.all(user.FriendsRequest.map(async friend => {
                let findFriend = await User.findOne({ _id: friend });
                let intersection = user.ListFriends.filter(element => findFriend.ListFriends.includes(element));
                return {
                  id: findFriend._id,
                  username: findFriend.username,
                  avatar: findFriend.avatar,
                  same_friends: intersection.length
                }
              }))
              requestData.sort(function(a, b) {
                var textA = a.username.toUpperCase();
                var textB = b.username.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
            
              let responseData = {
                list_users: requestData.slice(index,index+count),
                total: user.FriendsRequest.length
              } 
              console.log(requestData);
              return res.json({
                  code: "1000",
                  message: "ok",
                  data: responseData
              })
          }
      });
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})

router.post("/get_list_suggested_friends", (req,res) => {
  console.log('abc')
  const { token,index,count } = req.query;
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
              //Search user 
              if (!user) {
                  return res.json({
                      message: "Can't find user",
                      code: "9995",
                  });
              }
              //Check if user is locked
              if (user.locked == 1) {
                  return res.json({
                      message: "User is locked",
                      code: "9995",
                  });
              }

              let allUser = await User.find({});

              requestData = await Promise.all(allUser.map(async (user) => {
                let findFriend = await User.findOne({ _id: user });
                let intersection = user.ListFriends.filter(element => findFriend.ListFriends.includes(element));

                return {
                  id: user.id,
                  username: user.username,
                  avatar: user.avatar,
                  same_friends: intersection.length
                }
              }))
            
              let responseData = {
                list_users: requestData.slice(index,index+count),
              } 
              console.log(requestData);
              return res.json({
                  code: "1000",
                  message: "ok",
                  data: responseData
              })
          }
      });
  } catch (error) {
      return res.json({
          message: "Server error",
          code: "1001",
      });
  }
})
module.exports = router;
