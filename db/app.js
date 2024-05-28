const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controllers');

const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

module.exports = app;