const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// Show all categories
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            })

        });

});

// Show one category by ID
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDatabase) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not found.'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDatabase,
        });

    });

});

// Create new category
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id,
    });

    category.save((err, categoryDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDatabase) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDatabase,
        });

    });

});

// Update category
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let categoryDescription = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, categoryDescription, { new: true, runValidators: true }, (err, categoryDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDatabase) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDatabase,
        });

    });

});

// Delete category
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDatabase) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Category deleted.'
        })

    });

});

module.exports = app;