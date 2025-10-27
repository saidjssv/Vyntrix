const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
    const channelLog = "1430076092739223705";

    try {
        const owner = await guild.fetchOwner();
        const newGuildEmbed = new EmbedBuilder()
        .setTitle("Nuevo servidor agregado")
        .setDescription(`
📢 | **Información del servidor:**

🪄 | **Servidor**: ${guild.name}
🆔 | **ID del servidor**: ${guild.id}
👤 | **Dueño del servidor**: <@${owner.id}> / ${owner.user.tag}

`)
        .setColor("Blue")
        .setTimestamp()
        const icon = guild.iconURL({ extension: 'png', size: 1024, dynamic: true });
        if (icon) newGuildEmbed.setThumbnail(icon);

        const logChannel = await guild.client.channels.fetch(channelLog).catch(() => null);
        if (logChannel && logChannel.isTextBased()) {
            await logChannel.send({ embeds: [newGuildEmbed] });
        } else {
            console.log(`[guildCreate] No pude acceder al canal ${channelLog}`);
        }

    } catch (e) {
        console.log(e);
    }
    },
};
