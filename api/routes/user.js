const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

// @route  POST api/users
// @desc Register User

router.post("/signup", async (req, res) => {
  const { phonenumber, password, uuid } = req.query;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  try {
    //Check if params are missing
    if (Object.keys(req.query).length !== 3 || uuid.length <= 0 || password.length <= 0 || phonenumber.length <= 0) {
      return res.status(404).json({
        message: "Missing field",
        code: "1002",
      });
    }
    //Check if phone number is vaild
    else if (!vnf_regex.test(phonenumber)) {
      return res.status(404).json({
        message: "Invalid phone number",
        code: "1003",
      });
    }
    //Check if password is vaild
    else if (password.length < 6 || password.length > 10 || password.trim() === phonenumber.trim()) {
      return res.status(404).json({
        message: "Invalid password",
        code: "1003",
      });
    }
    //Check if user already exist
    let findUser = await User.find({ phonenumber: phonenumber });
    if (findUser.length > 0) {
      return res.status(409).json({
        message: "User existed",
        code: "9996",
      });
    }
    // Create a new user
    const salt = await bcrypt.genSalt(10);
    let saltPassword = await bcrypt.hash(password, salt);

    let user = new User({
      phonenumber: phonenumber,
      password: saltPassword,
      uuid: uuid,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "secretToken", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ 
        message: " User created",
        code: 1000,
        token,
      });
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
