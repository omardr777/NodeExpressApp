const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    driver: {
        type: Boolean,
        required: true
    }
    ,
    dates: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Date'
        }
    ],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'Request',

    }],
    points: {
        type: Number,
        default: 200
    },
    resetToken: {
        type: String
    },
    tokenExpreation: { type: Date }
})

module.exports = mongoose.model('User', userSchema)