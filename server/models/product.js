const mongoose = require('mongoose');
const category = require('./category');
const user = require('./user');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [
            true,
            'Argument \'name\' it\'s necessary.'
        ],
    },
    unitPrice: {
        type: Number,
        required: [
            true,
            'Argument \'unitPrice\' it\'s necessary.'
        ],
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    aviable: {
        type: Boolean,
        required: true,
        default: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: category,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: user,
    }
});

module.exports = mongoose.model('Product', productSchema);