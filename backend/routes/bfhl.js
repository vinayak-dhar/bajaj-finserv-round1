const express = require("express");
const router = express.Router();

const processHierarchy = require("../services/hierarchyService");

router.post("/", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "data must be an array"
      });
    }

    const result = processHierarchy(data);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

module.exports = router;