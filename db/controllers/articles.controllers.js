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

    if(req.query.sort_by){
        const validColumns = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count']
        if(!validColumns.includes(req.query.sort_by)) {
            next({ status: 404, msg: "Column does not exist" })
        }
    }

    if(req.query.order_by){
        const validOrderBy = ['asc', 'desc', 'ASC', 'DESC']
        if(!validOrderBy.includes(req.query.order_by)) {
            next({ status: 404, msg: "Invalid order_by" })
        }
    }

    fetchArticles(req.query.topic, req.query.sort_by, req.query.order_by)
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