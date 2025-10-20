const mongoose = require('mongoose');

const snipeSchema = new mongoose.Schema({
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    msg: {type: String, required: true },
    date: {type: Number, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 21600 }},
})

module.exports = mongoose.model('Snipe', snipeSchema);