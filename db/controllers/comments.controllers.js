const { fetchArticleById } = require("../models/articles.models")
const { fetchComments } = require("../models/comments.models")

exports.getComments = (req, res, next) => {
    Promise.all([fetchComments(req.params.article_id), fetchArticleById(req.params.article_id)])
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0];
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}