const express = require('express');
const app = express();
const mongoose = require('mongoose');

var monngoURL = 'mongodb://mongo/database'

app.get('/', (req, res) => {
    res.send('Hello World')
})

mongoose.connect(monngoURL, { useNewUrlParser: true })
    .then(
        () => {
            console.log("connected to mongo");
        }
    ).catch((error) => {
        console.log("unable to connect to mongoDB")
    });


app.listen(3000, function() {
    console.log('listening on 3000')
});