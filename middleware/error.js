const { logger } = require("../start/logger");

module.exports = function (error, req, res, next) {
  logger.info(error.message, error);
  res.status(404).send("Route Not Found.");
};
