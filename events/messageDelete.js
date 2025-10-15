const { Events } = require('discord.js');
const Snipe = require('../Schemas/snipeSchema');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        let data = await Snipe.findOne({ channelId: message.channel.id});

        if(!data) {
            let newdata = new Snipe({
                channelId: message.channel.id,
                userId: message.author.id,
                msg: message.content,
                date: Math.floor(Date.now() / 1000),
            })
            await newdata.save();
        }
        await Snipe.findOneAndUpdate({
            channelId: message.channel.id,
            userId: message.author.id,
            msg: message.content,
            date: Math.floor(Date.now() / 1000),
        })
    }
}