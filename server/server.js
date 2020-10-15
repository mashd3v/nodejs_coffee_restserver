// Config
require('./config/config');

// express
const express = require('express');
const app = express();

// body-parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/user', (req, res) => {
    res.json('GET User');
});

app.post('/user', (req, res) => {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Argument \'name\' it\'s necessary.'
        });
    } else {
        res.json({
            person: body
        });
    }
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id: id,
    });
});

app.delete('/user', (req, res) => {
    res.json('DELETE User');
});

app.listen(process.env.PORT, () => {
    console.log('Port: ', process.env.PORT);
})