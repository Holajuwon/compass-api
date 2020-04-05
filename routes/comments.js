const express = require("express");
const router = express.Router();
const pool = require("../elephantsql");

router.get("/", (req, res) => {
  pool
    .query(`SELECT * FROM user_comments`)
    .then((comments) => res.send(comments.rows))
    .catch((err) => res.status(500).send(err));
});

router.post("/", async (req, res) => {
  const { comment, author } = await req.body;
  const comm = await pool
    .query(
      `INSERT INTO user_comments(user_comment, author) VALUES($1, $2) RETURNING *`,
      [comment, author]
    )
    .then((comments) => res.status(201).send(comments.rows))
    .catch((err) => res.status(500).send(err));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await pool
    .query(`DELETE FROM user_comments WHERE user_id=$1 RETURNING *`, [id])
    .then((comments) => res.send(comments.rows))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req, res) => {
  const { comment } = req.body;
  const id = req.params.id;
  pool
    .query(
      `UPDATE user_comments SET user_comment=$1 WHERE user_id=$2 RETURNING *`,
      [comment, id]
    )
    .then((comments) => res.send(comments.rows))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
