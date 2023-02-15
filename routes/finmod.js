const express = require("express");
const router = express.Router();
const config = require("../config.js")

/* This is a post request to the finMod API. */
router.post('/historical', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}historical-chart/1min/${req.body.query.symbol.toUpperCase()}?apikey=${config.finModkey}`, (response) => {
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