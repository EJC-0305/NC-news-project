const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const { getArticleById, getArticles, patchArticle } = require('./controllers/articles.controllers');
const { getComments, postComment } = require('./controllers/comments.controllers');

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchArticle);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComment);

app.all('*', (req, res) => {
    res.status(404).send({msg: "Not found"})
      })

app.use((err, req, res, next) => {
    if(err.msg){
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if(err.code === '23503') {
        let msg = "Article does not exist";
        if(err.detail.includes('author')){
            msg = 'User does not exist';
        }
        res.status(404).send({ msg })
    } else {
        res.status(400).send({ msg: "Bad request" })
    }
  })

module.exports = app;