const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

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
      locked: "0"
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
    let user = await User.findOne({ phonenumber });

    if (user.length === 0) {
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
                $pull: { FriendsRequest: user_id },
                $push: { ListFriends: user_id },
              }
            );

            await User.findOneAndUpdate(
              {
                _id: requestFriend.id,
              },
              {
                $pull: { Req: user.id },
                $push: { ListFriends: user.id },
              }
            );
            return res.json({
              message: "Friend request's accepted",
              code: "1000",
            });
          //Remove request friend request isn't accepted
          } else if (is_accept == 0) {
            await User.findOneAndUpdate(
              {
                _id: user.id,
              },
              {
                $pull: { FriendsRequest: user_id },
              }
            );

            await User.findOneAndUpdate(
              {
                _id: requestFriend.id,
              },
              {
                $pull: { Req: user.id },
              }
            );
            return res.json({
              message: "Friend request's denined",
              code: "1000",
            });
          }
        }
      }
    });
  } catch (error) {
    return res.json({
      message: error,
      code: "9996",
    });
  }
});

module.exports = router;
