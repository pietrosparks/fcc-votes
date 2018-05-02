const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    token: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
})
userSchema.plugin(uniqueValidator);
module.exports = Mongoose.model('Users', userSchema);