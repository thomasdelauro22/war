const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    try {
        console.log("Welcome");
    } catch (err) {
        res.json(err);
    }
});

//Import Route
const playerRoute = require('./routes/playwar.js');
app.use('/playwar', playerRoute);

//DB connection
mongoose.connect(process.env.DB_CONNECTION, 
    () => { console.log('connected to db')
});

app.listen(3000);