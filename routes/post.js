const express = require("express");
const router = express.Router();
const pool = require("../elephantsql");

router.get("/", (req, res) => {
  pool
    .query(`SELECT * FROM user_posts LIMIT(10)`)
    .then((posts) => res.send(posts.rows))
    .catch((err) => res.status(500).send(err));
});

router.post("/", async (req, res) => {
  const { post, author } = await req.body;
  const comm = await pool
    .query(
      `INSERT INTO user_posts(user_post, author, post_date) VALUES($1, $2, $3) RETURNING *`,
      [post, author, Date.now()]
    )
    .then((posts) => res.status(201).send(posts.rows))
    .catch((err) => res.status(500).send(err));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await pool
    .query(`DELETE FROM user_posts WHERE post_id=$1 RETURNING *`, [id])
    .then((posts) => res.send(posts.rows))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req, res) => {
  const { post } = req.body;
  const id = req.params.id;
  console.log({ id, post });
  pool
    .query(`UPDATE user_posts SET user_post=$1 WHERE post_id=$2 RETURNING *`, [
      post,
      id,
    ])
    .then((posts) => res.send(posts.rows))
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
