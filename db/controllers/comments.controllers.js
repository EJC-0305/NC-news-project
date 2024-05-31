const { fetchArticleById } = require("../models/articles.models")
const { fetchComments, createComment, removeComment } = require("../models/comments.models")

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

exports.postComment = (req, res, next) => {
    createComment(req.body, req.params.article_id)
    .then((new_comment) => {
        res.status(201).send({ new_comment })
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id)
    .then((data) => {
        if(!data.rowCount) {
            next({ status: 404, msg: "Comment does not exist" });
        } else{
            res.status(204).send();
        }
    })
    .catch((err) => {
        next(err)
    })
}