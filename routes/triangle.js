const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { a, b, c } = req.body;

  if (a === b && b === c) return res.send("Equilateral");
  if (a === b || b === c || a === c) return res.send("Isosceles");
  if (a !== b && b !== c && a !== c) return res.send("Scalene");
  return res.send("incorrect");
});

module.exports = router;
