const express = require("express");
const router = express.Router();
const pool = require("../elephantsql");
const {
  validateComment,
  validateCommentUpdate,
} = require("../middlewares/validation");

router.get("/", async (req, res) => {
  const comments = await pool.query(
    `SELECT * FROM user_comments ORDER BY comment_date DESC`
  );
  res.send(comments.rows);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await pool.query(
    `SELECT * FROM user_comments WHERE post_id=$1 ORDER BY comment_date DESC LIMIT(5)`,
    [id]
  );
  const count = await pool.query(
    `SELECT COUNT(*) FROM user_comments WHERE post_id=$1`,
    [id]
  );
  if (comments.rowCount === 0)
    return res.status(404).send(`comment with id ${id} does not exist`);
  res.send({comment:comments.rows, ...count.rows[0]});
});

router.post("/:id", async (req, res) => {
  const post_id = req.params.id;
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { comment, author } = await req.body;
  const comm = await pool.query(
    `INSERT INTO user_comments(user_comment, author, post_id) VALUES($1, $2, $3) RETURNING *`,
    [comment, author||'Anonymous', post_id]
  );
  res.status(201).send(comm.rows);
});

router.delete("/:id", async (req, res) => {
  const comment_id = req.params.id;
  const comments = await pool.query(
    `DELETE FROM user_comments WHERE comment_id=$1 RETURNING *`,
    [comment_id]
  );
  res.send(comments.rows);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCommentUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { comment } = req.body;
  const comment_id = req.params.id;
  const comments = await pool.query(
    `UPDATE user_comments SET user_comment=$1 WHERE comment_id=$2 RETURNING *`,
    [comment, comment_id]
  );
  res.send(comments.rows);
});

module.exports = router;
