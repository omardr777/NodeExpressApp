const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    fromTime: Number,
    toTime: Number,
    time: String,
    timeId: {
        type: String
    },
    status:
    {
        type: String,
        default: 'waiting'
    }
    ,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateId: {
        type: Schema.Types.ObjectId,
        ref: 'Date'
    },
    description: {
        type: String
    },
    special: {
        type: Boolean,
        default: false
    },
    date: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Request', requestSchema)