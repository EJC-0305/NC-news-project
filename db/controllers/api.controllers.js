const { fetchEndpoints } = require("../models/api.models");
const fs = require('fs');

exports.getEndpoints = (req, res) => {
    fs.readFile('endpoints.json', (err, data) => {
        const endpoints = JSON.parse(data);
        res.status(200).send({ endpoints });
    });
}