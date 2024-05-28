const { fetchEndpoints } = require("../models/api.models")

exports.getEndpoints = (req, res) => {
    fetchEndpoints()
    .then((endpoints) => {
        res.status(200).send({ endpoints })
    })
}