const mongoose = require('mongoose');

const snipeSchema = new mongoose.Schema({
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    msg: {type: String, required: true },
    date: {type: Number, required: true },
})

module.exports = mongoose.model('Snipe', snipeSchema);