const express = require("express");
const {
  getTopics,
  getApiEndpoints,
  getArticleById,
  getArticles,
} = require("./controllers/get.controllers");
const app = express();

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

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
  } else next(err);
});

// Catch all
app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

module.exports = app;
