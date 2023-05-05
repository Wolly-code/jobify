const { Job, validate } = require("../models/job");

const checkPermission = async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send("The job with the given ID was not found.");
  
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).send("Access denied");
    }
  
    next();
  };
  
  module.exports = checkPermission;