const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error)
    return res.status(400).send({
      error: error.details[0].message,
    });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      error: "Invalid email or password.",
    });

  console.log(user.password);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword);
  if (!validPassword)
    return res.status(400).send({
      error: "Invalid email or password.",
    });

  const token = user.generateAuthToken();

  res.send({
    user: _.pick(user, ["_id", "name", "email"]),
    // user: user,
    token: token,
    location: user.location,
  });
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      error: error.details[0].message,
    });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send({
      error: "User already registered.",
    });

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send({
    user: _.pick(user, ["_id", "name", "email"]),
    // user: user,
    token: token,
    location: user.location,
  });
});

router.get("/", async (req, res) => {
  res.send("Whats up puta?");
});

router.patch("/", async (req, res) => {
  res.send("Whats up puta?");
});

function validateLogin(req) {
  try {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    }).options({ allowUnknown: true });
    return schema.validate(req);
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
