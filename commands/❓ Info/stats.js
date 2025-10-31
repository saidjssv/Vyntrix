const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const process = require("process");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Muestra estadísticas e información del bot."),
    async execute(interaction) {
        const client = interaction.client;
        const totalMembers = client.guilds.cache.reduce(
            (acc, guild) => acc + guild.memberCount,
            0
        );

        const uptimeSeconds = Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const statsEmbed = new EmbedBuilder()
            .setColor("DarkPurple")
            .setTitle("📊 | Estadísticas del Bot").setDescription(`
🎖️ **Información General**
> 👑 **Developer:** <@1185786435933065276>
> ⏱️ **Uptime:** ${uptimeString}
> 🧑‍💻 **Usuarios:** ${totalMembers.toLocaleString()}
> 🤖 **Servidores:** ${client.guilds.cache.size}
> 💬 **Canales:** ${client.channels.cache.size.toLocaleString()}
> 📚 **Librería:** Discord.js v14
`);

        await interaction.reply({ embeds: [statsEmbed] });
    },
};
