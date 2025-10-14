const { Events } = require('discord.js');


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if(message.author.id === '') {
            message.channel.send('https://media.discordapp.net/attachments/1197014287550533745/1427087653958062100/caption-6.gif?ex=68ed9672&is=68ec44f2&hm=51f661fe6925e6276d62b46a6fdcd533a898206d9087e32ea9c8c4cb8ddebe44&=&width=300&height=391')
        }
    }
}