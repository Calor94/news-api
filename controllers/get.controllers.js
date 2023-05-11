const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
} = require("../models/get.models");
const endpointFile = require("../endpoints.json");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getApiEndpoints = (req, res) => {
  res.status(200).send(endpointFile);
};

exports.getArticles = (req, res) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};
