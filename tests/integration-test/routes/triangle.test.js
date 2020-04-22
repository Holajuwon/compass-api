/**
 * @jest-environment node
 */

let request = require("supertest");

describe("/api/triangle", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
  });

  describe("POST", () => {
    it("should return equilateral if all sides are equal", async () => {
      const res = await request(server)
        .post("/api/triangle")
        .send({ a: 1, b: 1, c: 1 });
      expect(res.text).toBe("Equilateral");
    });

    it("should return scalene if all sides are not equal", async () => {
      const res = await request(server)
        .post("/api/triangle")
        .send({ a: 1, b: 2, c: 3 });
      expect(res.text).toBe("Scalene");
    });

    it("should return iscosceles if two sides are equal", async () => {
      const res = await request(server)
        .post("/api/triangle")
        .send({ a: 1, b: 2, c: 1 });
      expect(res.text).toBe("Isosceles");
    });

    it("should return incorrect if input are not valid", async () => {
      const res = await request(server)
        .post("/api/triangle")
        .send({ a: 0, b: 1, c: 3 });
      expect(res.text).toBe("incorrect");
    });
  });
});
