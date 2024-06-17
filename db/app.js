const express = require('express');
const apiRouter = require('./routers/api-router.js');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

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