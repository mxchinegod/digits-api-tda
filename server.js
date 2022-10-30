const express = require("express")
const config  = require("./config.js")
const app = express()
var cors = require('cors')
app.use(cors())
app.use(express.json())
app.use("/",                require("./routes/index"))
app.use("/tda",                require("./routes/tda"))

app.listen(config.servicePort,function(){
    console.log(`Now listening on ${config.servicePort}`)
})
