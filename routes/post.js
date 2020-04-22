const express = require("express");
const router = express.Router();
const pool = require("../elephantsql");
const {
  validatePost,
  validatePostUpdate,
} = require("../middlewares/validation");

router.get("/", async (req, res) => {
  const posts = await pool.query(
    `SELECT * FROM user_posts ORDER BY post_date DESC LIMIT(10) `
  );
  res.send(posts.rows);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await pool.query(`SELECT * FROM user_posts WHERE post_id=$1`, [
    id,
  ]);
  if (post.rowCount === 0)
    return res.status(404).send(`post with id ${id} does not exist`);
  res.send(post.rows);
});

router.post("/", async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { title, content, url, author } = await req.body;

  const comm = await pool.query(
    `INSERT INTO user_posts(post_title, post_content, image_url, author, post_date) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [title, content, url, author, Date.now()]
  );
  res.status(201).send(comm.rows);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const post = await pool.query(
    `DELETE FROM user_posts WHERE post_id=$1 RETURNING *`,
    [id]
  );
  res.send(post.rows);
});

router.put("/:id", async (req, res) => {
  const { error } = validatePostUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { content, title, url } = req.body;

  const id = req.params.id;

  const posts = await pool.query(
    `UPDATE user_posts SET post_title=$1, post_content=$2, image_url=$3 WHERE post_id=$4 RETURNING *`,
    [title, content, url, id]
  );
  res.send(posts.rows);
});

module.exports = router;
