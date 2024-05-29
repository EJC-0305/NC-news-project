const db = require('../connection.js')

exports.fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article does not exist" })
        }
        return result.rows[0];
    });
}

exports.fetchArticles = () => {
    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.*) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY comments.article_id, articles.article_id ORDER BY created_at DESC')
    .then((result) => {
        return result.rows;
    })
}