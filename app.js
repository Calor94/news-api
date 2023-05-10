const express = require("express");
const { getTopics, getApiEndpoints } = require("./controllers/get.controllers");
const app = express();

app.get("/api", getApiEndpoints);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

module.exports = app;
