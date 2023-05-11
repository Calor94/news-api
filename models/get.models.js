const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = () => {
  return connection
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.fetchArticleById = (articleId) => {
  return connection
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id ${articleId}`,
        });
      }
      return article;
    });
};
