const express = require("express");
const router = express.Router();
const config = require("../config.js")

/* This is a post request to the finMod API. */
router.post('/historicalPrices', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/historical-price-full/${req.body.query.symbol.toUpperCase()}?apikey=${config.finModkey}`, (response) => {
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

router.post('/secFiling', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/sec_filings/${req.body.query.symbol.toUpperCase()}?page=0&apikey=${config.finModkey}`, (response) => {
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

router.post('/financialGrowth', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/financial-growth/${req.body.query.symbol.toUpperCase()}?period=quarter&limit=16&apikey=${config.finModkey}`, (response) => {
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

router.post('/financialRatios', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/ratios-ttm/${req.body.query.symbol.toUpperCase()}?period=quarter&limit=16&apikey=${config.finModkey}`, (response) => {
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


router.post('/dcf', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/company/discounted-cash-flow/${req.body.query.symbol.toUpperCase()}?apikey=${config.finModkey}`, (response) => {
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

router.post('/erTranscript', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/earning_call_transcript/${req.body.query.symbol.toUpperCase()}?quarter=${req.body.quarter}&year=${req.body.year}&apikey=${config.finModkey}`, (response) => {
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

router.post('/senateDisclosure', function (req, res, next) {
    const https = require("https");
    https.request(`${config.finModHost}v3/historical-chart/1min/${req.body.query.symbol.toUpperCase()}?apikey=${config.finModkey}`, (response) => {
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