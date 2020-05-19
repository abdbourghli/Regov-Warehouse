const express = require('express'),



// use enviroment port in production or port 5000 for local development or
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))