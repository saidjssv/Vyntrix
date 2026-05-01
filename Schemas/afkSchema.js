const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
    motivo: { type: String, required: false },
    userId: { type: String, required: true},
    guildId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    mentions: { type: Number, default: 0 }
})

afkSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('afk', afkSchema);