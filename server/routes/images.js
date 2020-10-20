const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyImageToken } = require('../middlewares/authentication');
const app = express();

app.get('/image/:type/:image', verifyImageToken, (req, res) => {

    let type = req.params.type;
    let image = req.params.image;
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});

module.exports = app;