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

describe("/api/articles", () => {
  test("GET /api/articles responds with status 200 and an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          if (article.article_id === 1) {
            expect(article.comment_count).toBe(11);
          }
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.hasOwnProperty("body")).toBe(false);
        });
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
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
        expect(body.article_id).toBe(5);
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

describe("GET /api/articles/:article_id/comments", () => {
  test("GET /api/articles/:article_id/comments responds with status 200 and an array of comments for the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(11);
        body.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET /api/articles/:article_id/comments responds with status 200 and an empty array, when given an article id that exists, but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([]);
      });
  });
  test("GET /api/articles/:article_id/comments responds with status 404 and error message when given a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/621/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 621 does not exist");
      });
  });
  test("GET /api/articles/:article_id/comments responds with status 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST /api/articles/:article_id/comments responds with status 201 and the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "icellusedkars", body: "Test..." })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(19);
        expect(body.comment.body).toBe("Test...");
        expect(body.comment.article_id).toBe(2);
        expect(body.comment.author).toBe("icellusedkars");
        expect(body.comment.votes).toBe(0);
        expect(body.comment.created_at).not.toBe(undefined);
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 400 and an error message when passed with an empty object", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please enter username and body");
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 400 and an error message when missing body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "icellusedkars" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please enter username and body");
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 400 and an error message when missing username", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "Test..." })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please enter username and body");
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 404 and error message when passed with a valid article id that does not exist", () => {
    return request(app)
      .post("/api/articles/2124/comments")
      .send({ username: "icellusedkars", body: "Test..." })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 400 and error message when passed with an invalid article id", () => {
    return request(app)
      .post("/api/articles/invalid/comments")
      .send({ username: "icellusedkars", body: "Test..." })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("POST /api/articles/:article_id/comments responds with status 400 and error message when passed with a username that does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "unknown", body: "Test..." })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
