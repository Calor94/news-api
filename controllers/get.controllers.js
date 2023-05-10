const { fetchTopics } = require("../models/get.models");
const endpointFile = require("../endpoints.json");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getApiEndpoints = (req, res) => {
  res.status(200).send(endpointFile);
};
