const db = require('../connection.js')

exports.fetchArticleById = (article_id) => {
    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.*) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE articles.article_id = $1  GROUP BY comments.article_id, articles.article_id ORDER BY created_at DESC', [article_id]).then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article does not exist" })
        }
        return result.rows[0];
    });
}

exports.fetchArticles = (topic, sort_by, order_by) => {
    let query = 'SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.*) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id';
    const queryValues = [];

    if(topic) {
        query += ` WHERE articles.topic = $1`;
        queryValues.push(topic);
    }
    query += ` GROUP BY comments.article_id, articles.article_id, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url`

    if(sort_by) query += ` ORDER BY ${sort_by}`;
    else query += ` ORDER BY created_at`;
    
    if(order_by) query += ` ${order_by}`;
    else query += ` DESC`;

    return db.query(query, queryValues)
    .then((result) => {
        return result.rows;
    })
}

exports.updateVotes = (votes, article_id) => {
    let query = 'UPDATE articles SET votes = votes';
    const params = [article_id];

    if(votes.inc_votes) {
        query += ` + $1 WHERE article_id = $2 RETURNING *`;
        params.unshift(votes.inc_votes);
    } else {
        query += ` WHERE article_id = $1 RETURNING *`
    }

    return db.query(query, params)
    .then((result) => {
        if(!result.rows.length){
            return Promise.reject({ status: 404, msg: "Article does not exist" })
        }
        return result.rows[0];
    })
}