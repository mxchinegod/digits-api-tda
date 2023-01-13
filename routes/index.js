const express = require("express");
const router = express.Router();

/* A route that returns the health of the application. */
router.get('/', (req, res) => {
    var health = {};
    var fs = require('fs'), obj
    fs.readFile(`${__dirname}/../config.json`, handleFile)
    function handleFile(err, data) {
        if (err) { health.config({ "status": "unhealthy", "error": err }); return; }
        obj = JSON.parse(data)
        health.config = { "status": "healthy", "keys": Object.keys(obj).length }
        health.isUp = {
            uptime: process.uptime(),
            message: 'OK',
            date: new Date()
        }
        res.json(health);
    }
});

module.exports = router;