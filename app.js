const express = require("express");
const {
  getTopics,
  getApiEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  incrementVotes,
} = require("./controllers/get.controllers");
const app = express();

app.use(express.json());

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", incrementVotes);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

// Custom error handler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// PSQL error handler
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Please enter username and body" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else next(err);
});

// Catch all
app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

module.exports = app;
