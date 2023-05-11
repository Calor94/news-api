const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticle = (articleId) => {
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

// exports.selectSnackById = (snack_id) => {
//   return db
//     .query("SELECT * FROM snacks WHERE snack_id = $1;", [snack_id])
//     .then((result) => result.rows[0]);
// };
