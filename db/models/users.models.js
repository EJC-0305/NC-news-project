const db = require('../connection.js')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((result) => {
        return result.rows;
    })
}

exports.fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if(!result.rows.length){
            return Promise.reject({ status: 404, msg: "User does not exist" })
        }
        return result.rows[0];
    })
}