const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dateSchema = new Schema({
    day: {
        type: String
    },
    times: [

    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Date', dateSchema)