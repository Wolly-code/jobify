const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const auth = require("../middleware/auth");
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
    user: _.pick(user, ["_id", "name", "email", "lastName", "location"]),
    // user: user,
    token: token,
    location: user.location,
  });
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body, true);
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
    user: _.pick(user, ["_id", "name", "email", "lastName", "location"]),
    // user: user,
    token: token,
    location: user.location,
  });
});

router.get("/", auth, async (req, res) => {
  res.send("Whats up puta?");
});

router.patch("/", auth, async (req, res) => {
  try {
    // Validate the request body for non-password updates
    console.log(req);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find the user by ID and update their non-sensitive details
    const user = await User.findOneAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        // email: req.body.email,
        lastName: req.body.lastName,
        location: req.body.location,
      },
      { new: true }
    );
    if (!user)
      return res.status(404).send({ error: "Cannot find the requested user" });

    // Return the updated user object
    res.send({
      user: _.pick(user, ["_id", "name", "email", "lastName", "location"]),
      // user: user,
      token: req.savedToken,
      location: user.location,
    });
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    res.status(500).send(error.message);
  }
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
