const express = require("express");
const auth = require("../routes/auth");
const jobs = require("../routes/jobs");
const error = require("../middleware/error");
const cors = require("cors");
const morgan = require("morgan");
module.exports = function (app) {
  app.use(cors());
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/jobs", jobs);
  app.use(error);
};
