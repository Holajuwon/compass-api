/**
 * @jest-environment node
 */

let request = require("supertest");
const pool = require("../../../elephantsql");

describe("/api/post", () => {
  let server;
  let data;
  let id;
  let init = async () => {
    return await pool.query(
      `INSERT INTO user_posts(post_title, post_content, author, post_date) VALUES($1, $2, $3, $4) RETURNING *`,
      ["test_title", "test_post1", "test_author", Date.now()]
    );
  };

  beforeEach(async () => {
    server = require("../../../index");
    data = await init();
    id = data.rows[0].post_id;
  });

  afterEach(async () => {
    await server.close();
    await pool.query(`DELETE FROM user_posts WHERE author=$1`, ["test_author"]);
  });

  afterAll(async () => {
    await server.close();

    await new Promise((resolve) => setTimeout(() => resolve(), 500));
  });

  describe("GET /api/post", () => {
    it("should return all posts", async () => {
      const res = await request(server).get("/api/post");
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("post_content", "test_post1");
      expect(res.body[0]).toHaveProperty("author", "test_author");
      expect(Object.keys(res.body[0])).toEqual(
        expect.arrayContaining([
          "post_date",
          "post_id",
          "author",
          "post_title",
          "post_content",
        ])
      );
    });
  });

  describe("GET /api/post/:id", () => {
    let exec = async () => {
      return await request(server).get(`/api/post/${id}`);
    };

    it("should return 404 if id not found", async () => {
      id = "40f18850-8330-11ea-9f3b-08119610fd30";
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return post with valid id", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty(
        "post_content",
        data.rows[0].post_content
      );
      expect(res.body[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body[0]).toHaveProperty("post_date", data.rows[0].post_date);
      expect(res.body[0]).toHaveProperty("post_id", id);
    });

    it("should return 500 if invalid id", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/post", () => {
    let body = {
      title: "test_post",
      content: "test_post1",
      author: "test_author",
    };
    let exec = async () => {
      return await request(server).post("/api/post").send(body);
    };
    it("should return new added post if everything goes right", async () => {
      const res = await exec();
      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty("post_content", "test_post1");
      expect(res.body[0]).toHaveProperty("author", "test_author");
      expect(res.body[0]).toHaveProperty("post_date");
      expect(res.body[0]).toHaveProperty("post_id");
      expect(res.body.length).toBe(1);
    });

    it("should return 400 if something went wrong", async () => {
      body = { post_content: null, author: "test_author" };
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/post/:id", () => {
    let exec = async () => {
      return await request(server).delete(`/api/post/${id}`).send();
    };

    it("should delete post and return deleted post", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("user_post", data.rows[0].user_post);
      expect(res.body[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body[0]).toHaveProperty("post_date", data.rows[0].post_date);
      expect(res.body[0]).toHaveProperty("post_id", id);
    });
    it("should return 500 if invalid id", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/post/:id", () => {
    let update = { content: "updatedpost", title: "test_title" };
    let exec = async () => {
      return await request(server).put(`/api/post/${id}`).send(update);
    };

    beforeEach(() => {});

    it("should return 200 with correct id", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return updated post", async () => {
      const res = await exec();
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("post_content", update.content);
      expect(res.body[0]).toHaveProperty("author", data.rows[0].author);
      expect(res.body[0]).toHaveProperty("post_date", data.rows[0].post_date);
      expect(res.body[0]).toHaveProperty("post_id", id);
    });

    it("should return 404 if id not found", async () => {
      id = "";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return if invalid update", async () => {
      const data = await init();
      id = data.rows[0].post_id;
      update = {};
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});
