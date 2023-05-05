const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
router.get("/", auth, async (req, res) => {
  res.json("Getting Jobs");
});
router.get("/stats", auth, async (req, res) => {
  res.send("Getting stats");
});

router.post("/", auth, async (req, res) => {
  res.send("Creating Job");
});

router.put("/", auth, async (req, res) => {
  res.send("PUtting job");
});

router.delete("/:id", auth, async (req, res) => {
  res.send(req.params.id);
});

module.exports = router;
