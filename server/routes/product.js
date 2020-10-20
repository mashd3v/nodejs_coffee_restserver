const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { populate } = require('../models/product');

let app = express();
let Product = require('../models/product');

// Get all products
app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ aviable: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products,
            });

        });

});

// Get product by ID
app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productDatabase) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDatabase) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDatabase,
            });

        });

});

// Search product
app.get('/product/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });

        });

});

// Create product
app.post('/product', verifyToken, (req, res) => {

    let body = req.body;
    let product = new Product({
        user: req.user._id,
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        aviable: body.aviable,
        category: body.category,
    });

    product.save((err, productDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDatabase,
        });

    });

});

// Update product
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDatabase) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found.'
                }
            });
        }

        productDatabase.name = body.name;
        productDatabase.unitPrice = body.unitPrice;
        productDatabase.description = body.description;
        productDatabase.aviable = body.aviable;
        productDatabase.category = body.category;

        productDatabase.save((err, productSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSaved
            });

        });

    });

});

// Delete product
app.delete('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDatabase) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDatabase) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found.'
                }
            });
        }

        productDatabase.aviable = false;

        productDatabase.save((err, productDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productDeleted,
                message: 'Product deleted.',
            });

        });

    });

});

module.exports = app;