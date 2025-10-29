const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const process = require("process");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Muestra estadísticas e información del bot."),
    async execute(interaction) {
        const { client } = interaction;
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

🖥️ **Hardware Info**
> 💻 **Sistema Operativo:** ${os.type()} ${os.release()}
> 🧮 **CPU:** ${os.cpus().length}x ${os.cpus()[0].model}
> 🧱 **Memoria Total:** ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
> 🏗️ **Memoria Libre:** ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
`);

        await interaction.reply({ embeds: [statsEmbed] });
    },
};
