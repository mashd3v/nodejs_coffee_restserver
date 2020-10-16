const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role.'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Argument \'name\' it\'s necessary.'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Argument \'email\' it\'s necessary.'],
    },
    password: {
        type: String,
        required: [true, 'Argument \'password\' it\'s necessary.'],
    },
    image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles,
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.toJSON = function() {
    let thisUser = this;
    let userObject = thisUser.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model('user', userSchema);