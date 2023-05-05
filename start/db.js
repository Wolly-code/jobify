const mongoose = require("mongoose");
const winston = require("winston");
require("dotenv").config();

module.exports = function (params) {
  mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    winston.info(`Connected to ${process.env.CONNECTION_STRING}`);
  });
};
