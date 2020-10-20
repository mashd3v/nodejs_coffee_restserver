const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

// Default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Validate type
    let validTypes = ['product', 'user'];

    if (validTypes.indexOf(type) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: `Valid types are: ${validTypes.join(', ')}.`
            }
        });

    }

    let file = req.files.file;
    let cuttedFileName = file.name.split('.');
    let extension = cuttedFileName[cuttedFileName.length - 1];

    // Allowed extensions
    let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (allowedExtensions.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: `File \'${file.name}\' cannot be uploaded because the extension is not valid. Allowed extensions are: ${allowedExtensions.join(', ')}.`
            }
        });

    }

    // Changing file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Move file to upload dir
    file.mv(`uploads/${type}s/${fileName}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (type === 'user') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }

    });

});

function userImage(id, res, fileName) {

    User.findById(id, (err, userDatabase) => {

        if (err) {
            deleteImage(fileName, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDatabase) {
            deleteImage(fileName, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This user does not exist.'
                }
            });
        }

        deleteImage(userDatabase.image, 'users');

        userDatabase.image = fileName;

        userDatabase.save((err, userSaved) => {

            res.json({
                ok: true,
                user: userSaved,
                image: fileName,
            })

        });

    });

}

function productImage(id, res, fileName) {

    Product.findById(id, (err, productDatabase) => {

        if (err) {
            deleteImage(fileName, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDatabase) {
            deleteImage(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'This product does not exist.'
                }
            });
        }

        deleteImage(productDatabase.image, 'products');

        productDatabase.image = fileName;

        productDatabase.save((err, productSaved) => {

            res.json({
                ok: true,
                product: productSaved,
                image: fileName,
            })

        });

    });

}

function deleteImage(imageName, type) {

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }

}

module.exports = app;