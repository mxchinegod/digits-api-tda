const express = require("express");
const router = express.Router();
const config  = require("../config.js")

router.post('/options', function (req, res, next) {
    const https = require("https");
    https.request(`${config.tdaHost}/v1/marketdata/chains?apikey=${config.consumer}&symbol=${req.body.query.symbol.toUpperCase()}&contractType=${req.body.query.type}&strikeCount=${req.body.query.strikeCount}&includeQuotes=TRUE&fromDate=${req.body.query.fromDate}&toDate=${req.body.query.toDate}`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        })
        response.on('end', () => {
            res.json(JSON.parse(data))
        })
    })
    .on('error', (error) => {
        console.log('An error', error);
    })
    .end()
});

module.exports = router;