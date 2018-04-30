const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = Schema({

    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    options: {
        type: Array,
        required:true
    },
    voters: {
        type: Array,
        default: [],
    },
    poll_id: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase:true,
    }


},{timestamp:true})

module.exports = mongoose.model('Polls', pollSchema);