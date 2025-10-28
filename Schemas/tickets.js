const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    guildId: { type: String, required: true},
    channelId: { type: String, required: true},
    staffRoleId: { type: String, required: true},
})

module.exports = mongoose.model('Ticket', ticketSchema);