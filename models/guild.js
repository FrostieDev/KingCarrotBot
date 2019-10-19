const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let guild = new Schema({
    guildID:{
        type: String
    },
    discID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        dateTo: Date
    }
});