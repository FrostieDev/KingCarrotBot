const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let user = new Schema({
    discID:{
        type: String
    },
    guildID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild'
    },
    discName:{
        type: String
    },
    amount: {
        type: Number
    },
    ban: {
        banned: Boolean,
        dateFrom: Date,
        dateTo: Date,
        lastBan: Date
    }
});