const mongoose = require("mongoose");
const Joi = require("joi");
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

function validateJob(job) {
  const schema = Joi.object({
    company: Joi.string().required().max(50),
    position: Joi.string().required().max(100),
    status: Joi.string()
      .valid("interview", "declined", "pending")
      .default("pending"),
    jobType: Joi.string()
      .valid("full-time", "part-time", "remote", "internship")
      .default("full-time"),
    jobLocation: Joi.string().required(),
  });

  return schema.validate(job);
}

exports.validate = validateJob;
exports.Job = Job;
