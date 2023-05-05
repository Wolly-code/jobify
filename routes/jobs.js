const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Job, validate } = require("../models/job");
const checkPermission = require("../middleware/checkPermission");
router.get("/", auth, async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user._id,
  }).select("-updatedAt -__v");

  res.json({ jobs, totalJobs: jobs.length, numOfPage: 1 });
});
router.get("/search", auth, async (req, res) => {
  // Parse pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;

  // Build query object for search and filtering
  const query = {};
  if (req.query.search) {
    query.$or = [
      { company: { $regex: req.query.search, $options: "i" } },
      { position: { $regex: req.query.search, $options: "i" } },
    ];
  }
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.jobType) {
    query.jobType = req.query.jobType;
  }

  // Execute search query and sort results
  const sort = {};
  if (req.query.sortBy) {
    sort[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }
  try {
    const jobs = await Job.find(query)
      .populate("createdBy", "-_id -password -__v -createdAt -updatedAt")
      .select("-updatedAt -__v")
      .sort(sort)
      .skip(skipIndex)
      .limit(limit);
    const totalJobs = await Job.countDocuments(query);

    res.json({
      jobs,
      totalJobs,
      numOfPage: Math.ceil(totalJobs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", auth, async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = [];
  res.status(200).json({ defaultStats, monthlyApplications });
});

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const job = new Job({
      ...req.body,
      createdBy: req.user._id,
    });
    const result = await job.save();
    res.send(result);
  } catch (error) {
    res.status(500);
  }
});

router.patch("/:id", auth, async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const exists = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!exists) return res.status(404).json({ error: "Job not found" });

  // Find the job by ID and update its details
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      company: req.body.company,
      position: req.body.position,
      status: req.body.status,
      jobType: req.body.jobType,
      jobLocation: req.body.jobLocation,
    },
    { new: true }
  );
  if (!job)
    return res.status(404).send({ error: "Cannot find the requested job" });

  // Return the updated job object
  res.send({
    job: job,
    message: "Job successfully updated",
  });
});

router.delete("/:id", [auth, checkPermission], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).send("The job with the given ID was not found.");

    await job.deleteOne();
    res.json({ message: "Job Deleted" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
