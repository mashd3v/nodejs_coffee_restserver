const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const app = express();

app.get('/user', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email image role status google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.estimatedDocumentCount({ status: true }, (err, counting) => {
                res.json({
                    ok: true,
                    totalUsers: counting,
                    users
                });
            });

        });

});

app.post('/user', (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    user.save((err, userDatabase) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDatabase
        });
    });

});

app.put('/user/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDatabase) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDatabase
        });
    });

});

app.delete('/user/:id', (req, res) => {

    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, deletedUser) => {
    let changeStatus = { status: false };
    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, deletedUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found.'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser,
        });

    });

});

module.exports = app;