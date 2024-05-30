const { fetchArticleById, fetchArticles, updateVotes } = require("../models/articles.models")
const { fetchTopics } = require("../models/topics.models")

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
    if(req.query.topic){
        fetchTopics()
        .then((topics) => {
            let isTopic = false;
            topics.forEach((topic) => {
                if(topic.slug === req.query.topic){
                    isTopic = true;
                }
            })
            if(!isTopic){
                next({ status: 404, msg: "Topic does not exist"})
            }
        })
    }
    fetchArticles(req.query.topic)
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
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