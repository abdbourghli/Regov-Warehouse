const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    user = require('./endpoints/user')


// use enviroment port in production or port 5000 for local development or
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname + "/")))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

// bodyParser middleware for parsing JSON body
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//user endpints
app.get('/users', user.list);