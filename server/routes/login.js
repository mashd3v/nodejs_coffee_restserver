const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDatabase) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The email address or password is incorrect. Please retry...'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDatabase.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The email address or password is incorrect. Please retry...'
                }
            });
        }


        let token = jwt.sign({
                user: userDatabase
            },
            process.env.AUTH_SEED, {
                expiresIn: process.env.TOKEN_EXPIRATION,
            }
        );

        res.json({
            ok: true,
            user: userDatabase,
            token,
        });

    });
});

module.exports = app;