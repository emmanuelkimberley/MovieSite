const express = require("express")
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'))

// parse requests to body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// set view engine
app.set("view engine", "ejs")

// // load assets
app.use('/static', express.static(path.join(__dirname, 'assets/css')))
app.use('/static', express.static(path.join(__dirname, 'assets/js')))
app.use('/static', express.static(path.join(__dirname, 'assets/img')))
app.use('/static', express.static(path.join(__dirname, 'assets/csv')))

// load routers
app.use('/', require('./server/router'))

app.listen(3000, () => { console.log(`Server running on http://localhost:${PORT}`); })