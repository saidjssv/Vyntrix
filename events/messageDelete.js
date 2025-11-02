const { Events } = require('discord.js');
const Snipe = require('../Schemas/snipeSchema');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        let data = await Snipe.findOne({ channelId: message.channel.id});

        await Snipe.findOneAndUpdate(
            { channelId: message.channel.id },
            {
                $set: {
                    userId: message.author.id,
                    msg: message.content || '[Sin contenido]',
                    date: Math.floor(Date.now() / 1000),
                }
            },
            { upsert: true, new: true }
        );
    }
}