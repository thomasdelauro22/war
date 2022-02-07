const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts.js');
app.use('/posts', postsRoute);

//DB connection
mongoose.connect(process.env.DB_CONNECTION, 
    () => { console.log('connected to db')
});

app.listen(3000);