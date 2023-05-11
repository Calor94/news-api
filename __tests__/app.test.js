const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const connection = require("../db/connection");
const endpointFile = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return connection.end();
});

describe("Invalid endpoint", () => {
  test("If an endpoint doesn't exist, respond with a 404 and custom message", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });
});

describe("/api", () => {
  test("GET /api responds with status 200 and JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointFile);
      });
  });
});

describe("/api/topics", () => {
  test("GET /api/topics responds with status 200 and an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET /api/articles/:article_id responds with status 200 and the requested object", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.author).toBe("string");
        expect(typeof body.title).toBe("string");
        expect(typeof body.article_id).toBe("number");
        expect(typeof body.body).toBe("string");
        expect(typeof body.topic).toBe("string");
        expect(typeof body.created_at).toBe("string");
        expect(typeof body.votes).toBe("number");
        expect(typeof body.article_img_url).toBe("string");
      });
  });
  test("GET /api/articles/:article_id responds with status 404 and error message when given a valid article id but doesn't exist", () => {
    return request(app)
      .get("/api/articles/72")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article_id 72");
      });
  });
  test("GET /api/articles/:article_id responds with status 400 and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
