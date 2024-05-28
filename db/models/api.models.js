const fs = require('fs')

async function fetchEndpoints () {
    const data = await fs.promises.readFile('endpoints.json', (err, data) => {
        return data;
    });
    
    return JSON.parse(data)
}

module.exports = { fetchEndpoints }