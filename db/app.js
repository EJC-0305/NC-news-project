const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');
const { getArticleById } = require('./controllers/articles.controllers');

const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

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
    res.status(400).send({ msg: "Bad request" })
  })

module.exports = app;