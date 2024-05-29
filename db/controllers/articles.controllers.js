const { fetchArticleById, fetchArticles, updateVotes } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
}

exports.patchArticle = (req, res, next) => {
    updateVotes(req.body, req.params.article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}