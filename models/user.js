const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 5,
    maxlength: 1024,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxlength: 50,
    default: "my City",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY);
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    lastName: Joi.string().max(50),
    location: Joi.string().max(50),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
