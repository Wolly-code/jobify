const express = require("express");
const app = express("/");
require("dotenv").config(); // load environment variables from .env file

require("./start/router")(app);
require("./start/db")();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = server;
