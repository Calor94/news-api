const request = require("supertest");
const app = require("../app");

describe("/api/topics", () => {
  test("GET /api/topics responds with status 200 and responds with an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
