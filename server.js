const express = require('express');
const cron = require('node-cron')
const fs = require('fs')
const scheduler = require('./scheduler/scheduler')


const client = require('./config/pgadmindb')


const app = express();



client.connect()

//init middleware, allows user.js to get data, ie use req.body
app.use(express.json({ extended: false }));

scheduler

//define routes
app.use('/api/yugioh', require('./routes/api/yugioh'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));