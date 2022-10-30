const express = require("express");
const router = express.Router();
const config  = require("../config.js")

/* This is a route that is called when the user submits the form. It takes the form data and makes a
request to the TDAmeritrade API. It then returns the data to the user. */
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

/* This is a route that is called when the user submits the form. It takes the form data and makes a
request to the TDAmeritrade API. It then returns the data to the user. */
router.post('/volatility', function (req, res, next) {
    const https = require("https");
    const symbol = req.body.query.symbol.split('$')
    https.request(`${config.tdaHost}/v1/marketdata/chains?apikey=${config.consumer}&symbol=${symbol.length>1?symbol[1].toUpperCase():symbol[0].toUpperCase()}&contractType=${req.body.query.type}&strikeCount=${req.body.query.strikeCount}&includeQuotes=TRUE&fromDate=${req.body.query.fromDate}&toDate=${req.body.query.toDate}`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        })
        response.on('end', () => {
            var jsonData = JSON.parse(data)["callExpDateMap"]
            var final = {}
            for (each in jsonData) {
                const strikes = Object.keys(jsonData[each])
                var strikeMap = strikes.map(strike=>{
                    var option = Object.values(jsonData[each][strike])[0]
                    return strike = {
                        vol: option.volatility
                        , tVol: option.theoreticalVolatility
                        , category: option.symbol
                    }
                })
                final[each] = strikeMap
            }
            let workingData = Object.values(final)[0]
            workingData = workingData.slice().sort().reduceRight((acc, val, i) => {
                return i % 2 === 0 ? [...acc, val] : [val, ...acc];
            }, [])
            workingData.forEach((datum) => {
                datum.vol = (datum.vol.toString() * 1).toFixed(2)
                if (datum.vol == Math.min.apply(null, workingData.map((v) => { return v.vol }))) {
                    datum.color = "#89c83d"
                } else {
                    datum.color = "#7023cd"
                }
            })
            res.json(workingData)
        })
    })
    .on('error', (error) => {
        res.send(error)
    })
    .end()
});

module.exports = router;