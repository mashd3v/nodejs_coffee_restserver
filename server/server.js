require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
// body-parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Database is online now.');
});

app.listen(process.env.PORT, () => {
    console.log('Listening at port:', process.env.PORT);
})