const express = require("express");
const router = express.Router();
const config = require("../config.js")

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
    https.request(`${config.tdaHost}/v1/marketdata/chains?apikey=${config.consumer}&symbol=${symbol.length > 1 ? symbol[1].toUpperCase() : symbol[0].toUpperCase()}&contractType=${req.body.query.type}&strikeCount=${req.body.query.strikeCount}&includeQuotes=TRUE&fromDate=${req.body.query.fromDate}&toDate=${req.body.query.toDate}&range=ITM`, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data = data + chunk.toString();
        })
        response.on('end', () => {
            const _ = JSON.parse(data)
            if (_.status != 'FAILED') {
                var expMap = _["callExpDateMap"]
                var final = { strikeMap: {}, underlying: { mark: _.underlying["mark"], open: _.underlying["openPrice"], low: _.underlying["lowPrice"] } }
                for (each in expMap) {
                    const strikes = Object.keys(expMap[each])
                    var strikeMap = strikes.map(strike => {
                        var option = Object.values(expMap[each][strike])[0]
                        return strike = {
                            vol: parseInt(option.volatility)
                            , tVol: option.theoreticalVolatility
                            , strike: parseInt(strike)
                            , category: option.symbol
                            , openInterest: option.openInterest
                        }
                    })
                    final.strikeMap[each] = strikeMap
                }
                let workingData = Object.values(final.strikeMap)[0]
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
                final.strikeMap = workingData;
                final.pin = workingData.sort( 
                    function(a, b) {
                       return parseFloat(b['openInterest']) - parseFloat(a['openInterest']);
                    }
                  )[0]['strike'] 
                res.json(final)
            } else {
                res.json({ "message": "Bad request" })
            }
        })
    })
        .on('error', (error) => {
            res.send(error)
        })
        .end()
});

module.exports = router;