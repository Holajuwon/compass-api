/**
 * @jest-environment node
 */

let request = require("supertest");
const pool = require("../../../elephantsql");

describe("/api/comment", () => {
  let server;
  let data;
  let post_id;
  let comment_id;

  let init = async () => {
    const res = await pool.query(
      `INSERT INTO user_posts(post_title, post_content, author, post_date) VALUES($1, $2, $3, $4) RETURNING *`,
      ["test_title", "test_post1", "test_author", Date.now()]
    );

    return await pool.query(
      `INSERT INTO user_comments(user_comment, author, post_id) VALUES($1, $2, $3) RETURNING *`,
      ["test_comment1", "test_author", res.rows[0].post_id]
    );
  };

  beforeEach(async () => {
    data = await init();
    post_id = data.rows[0].post_id;
    comment_id = data.rows[0].comment_id;
    server = require("../../../index");
  });

  afterEach(async () => {
    await pool.query(`DELETE FROM user_comments WHERE author=$1`, [
      "test_author",
    ]);
    await pool.query(`DELETE FROM user_posts WHERE author=$1`, ["test_author"]);

    await server.close();
  });

  describe("GET /api/comment", () => {
    it("should return all comments", async () => {
      const res = await request(server).get("/api/comment");
      expect(res.status).toBe(200);
      expect(Object.keys(res.body[0])).toEqual(
        expect.arrayContaining(Object.keys(data.rows[0]))
      );
      expect(res.body[0]).toHaveProperty("user_comment", "test_comment1");
      expect(res.body[0]).toHaveProperty("author", "test_author");
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/comment/:id", () => {
    let exec = async () => {
      return await request(server).get(`/api/comment/${post_id}`);
    };

    it("should return comment with given post id", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.comment[0]).toHaveProperty(
        "user_comment",
        data.rows[0].user_comment
      );
      expect(res.body.comment[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body.comment[0]).toHaveProperty("comment_date");
      expect(res.body.comment[0]).toHaveProperty("post_id", post_id);
      expect(res.body.comment[0]).toHaveProperty("comment_id");
    });

    it("should return 404 if id not found", async () => {
      post_id = "6baf8b0c-7f64-11ea-bb8a-07dffc17721" + 9;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 500 if invalid id", async () => {
      post_id = 1;
      const res = await exec();
      expect(res.status).toBe(500);
    });
  });

  describe("post /api/comment/:id", () => {
    let body = {
      comment: "test_comment1",
      author: "test_author",
      post_id: post_id,
    };
    let exec = async () => {
      return await request(server).post(`/api/comment/${post_id}`).send(body);
    };
    it("should return new added comment if everything goes right", async () => {
      const res = await exec();
      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty("user_comment", "test_comment1");
      expect(res.body[0]).toHaveProperty("author", "test_author");
      expect(res.body[0]).toHaveProperty("comment_date");
      expect(res.body[0]).toHaveProperty("post_id", post_id);
      expect(res.body.length).toBe(1);
    });

    it("should 400 if something went wrong", async () => {
      body = { comment: null, author: "test_author" };
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/comment/:id", () => {
    let exec = async () => {
      return await request(server).delete(`/api/comment/${comment_id}`).send();
    };
    it("should delete comment and return deleted comment", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty(
        "user_comment",
        data.rows[0].user_comment
      );
      expect(res.body[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body[0]).toHaveProperty("comment_date");
      expect(res.body[0]).toHaveProperty("post_id", post_id);
    });

    it("should return 500 if invalid id", async () => {
      comment_id = 1;
      const res = await exec();
      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/comment/:id", () => {
    let update;
    let exec = async () => {
      return await request(server)
        .put(`/api/comment/${comment_id}`)
        .send(update);
    };
    it("should return 200 with correct id", async () => {
      update = { comment: "updatedcomment" };
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return updated comment", async () => {
      update = { comment: "updatedcomment" };
      const res = await exec();
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("user_comment", update.comment);
      expect(res.body[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body[0]).toHaveProperty("comment_date");
      expect(res.body[0]).toHaveProperty("post_id", post_id);
    });

    it("should return 500 if invalid id", async () => {
      comment_id = 1;
      const res = await exec();
      expect(res.status).toBe(500);
    });

    it("should return if invalid update", async () => {
      update = {};
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});
