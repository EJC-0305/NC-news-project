const db = require('../connection.js')

exports.fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article does not exist" })
        }
        return result.rows[0];
    });
}