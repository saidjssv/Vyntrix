const { Events, EmbedBuilder } = require('discord.js');
const afk = require('../Schemas/afkSchema');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (message.author.bot || !message.guildId) return;

        const currentAfk = await afk.findOne({ guildId: message.guildId, userId: message.author.id });

        if (currentAfk) {
            const afkEmbed = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('💤 | AFK')
                .setDescription(`**Tu estado afk ha sido removido.** \n> Estuviste **ausente** durante <t:${Math.floor(currentAfk.timestamp.getTime() / 1000)}:R> \n> Motivo: **${currentAfk.motivo}**\n> Fuiste mencionado un total de: **${currentAfk.mentions}**`)
                .setTimestamp();

            await afk.deleteOne({ guildId: message.guildId, userId: message.author.id });
            await message.reply({ embeds: [afkEmbed] });
        }

        const mentionedAfkUsers = message.mentions.users.filter(user => user.id !== message.author.id);

        if (!mentionedAfkUsers.size) return;

        for (const user of mentionedAfkUsers.values()) {
            const afkData = await afk.findOne({ guildId: message.guildId, userId: user.id });

            if (!afkData) continue;

            const afkMentioned = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('💤 | AFK')
                .setDescription(`**Shh!** <@${afkData.userId}> está actualmente AFK. \n> Motivo: **${afkData.motivo}**\n> Lleva ausente: <t:${Math.floor(afkData.timestamp.getTime() / 1000)}:R>`)
                .setTimestamp();

            afkData.mentions += 1;
            await afkData.save();

            await message.reply({ embeds: [afkMentioned] });
        }
    }
}