const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../models/user');
const user = require('../models/user');
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

// Google Configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });

    User.findOne({ email: googleUser.email }, (err, userDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDatabase) {
            if (userDatabase.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "This user can't login with Google because it's already registered. Please try logging with your email and password."
                    }
                });
            } else {
                let token = jwt.sign({
                        user: userDatabase
                    },
                    process.env.AUTH_SEED, {
                        expiresIn: process.env.TOKEN_EXPIRATION,
                    }
                );

                return res.json({
                    ok: true,
                    user: userDatabase,
                    token,
                });
            }
        } else {
            // If this user does not exist in our database
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.picture;
            user.google = true;
            user.password = ':v';

            user.save((err, userDatabase) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                        user: userDatabase
                    },
                    process.env.AUTH_SEED, {
                        expiresIn: process.env.TOKEN_EXPIRATION,
                    }
                );

                return res.json({
                    ok: true,
                    user: userDatabase,
                    token,
                });

            });

        }

    });

});

module.exports = app;