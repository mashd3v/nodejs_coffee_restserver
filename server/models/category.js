const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [
            true,
            'Argument \'description\' it\'s necessary.'
        ],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: user
    },
});

module.exports = mongoose.model('Category', categorySchema);