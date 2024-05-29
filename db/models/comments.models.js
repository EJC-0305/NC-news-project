const db = require('../connection.js')

exports.fetchComments = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
    .then((result) => {
        return result.rows;
    })
}

exports.createComment = (comment, article_id) => {
    return db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`, [comment.body, article_id, comment.username])
    .then((result) => {
        return result.rows[0];
    })
}