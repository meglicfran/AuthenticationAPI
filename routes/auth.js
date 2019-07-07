const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { registerValidation } = require("../validation");
const { loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const vali = registerValidation(req.body);
  if (vali.error) {
    res.send(vali.error.details[0].message);
    return;
  }
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    res.send("Email already exists");
    return;
  }
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) {
    res.send("Username already exists");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser._id);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const vali = loginValidation(req.body);
  if (vali.error) {
    res.send(vali.error.details[0].message);
    return;
  }
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.send("Username is incorrect");
    return;
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    res.send("Password is incorrect");
    return;
  }
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
