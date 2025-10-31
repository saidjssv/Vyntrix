const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstatus')
        .setDescription('Muestra estado y hardware del bot.'),
        async execute(interaction) {
            const client = interaction.client;

const uptime = process.uptime();
const uptimeHours = Math.floor(uptime / 3600);
const uptimeMinutes = Math.floor((uptime % 3600) / 60);
const uptimeSeconds = Math.floor(uptime % 60);

const totalMemory = os.totalmem() / 1024 / 1024;
const freeMemory = os.freemem() / 1024 / 1024;
const usedMemory = totalMemory - freeMemory;
const memoryUsagePercent = (usedMemory / totalMemory) * 100;

const cpuModel = os.cpus()[0].model;
const cpuCores = os.cpus().length;

function progressBar(percent) {
    const totalBars = 10;
    const filledBars = Math.round((percent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return `▰`.repeat(filledBars) + `▱`.repeat(emptyBars) + ` ${percent.toFixed(1)}%`;
}

const statusEmbed = new EmbedBuilder()
    .setColor('DarkPurple')
    .setTitle('🤖 | Estado del Bot')
    .setDescription(`
📊 **Estadísticas Generales**
────────────────────────
🟢 **Ping:** ${client.ws.ping}ms
⏱️ **Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s
👥 **Usuarios Totales:** ${client.users.cache.size.toLocaleString()}
🌐 **Servidores Activos:** ${client.guilds.cache.size.toLocaleString()}

🖥️ **Hardware Info**
────────────────────────
💻 **Sistema Operativo:** ${os.type()} ${os.release()}
🧮 **CPU:** ${cpuCores}x ${cpuModel.split(' ')[0]} (${cpuModel.split(' ').slice(1).join(' ')})
🧱 **Memoria Total:** ${totalMemory.toFixed(2)} MB
📦 **Memoria Usada:** ${usedMemory.toFixed(2)} MB
💡 **Uso de RAM:** ${progressBar(memoryUsagePercent)}

⚙️ **Software**
────────────────────────
🧩 **Node.js:** ${process.version}
🧠 **Discord.js:** v${require('discord.js').version}
`)
    .setFooter({ text: `Actualizado: ${new Date().toLocaleString()} | Sistema de Bot 🚀` })
    .setTimestamp();


            await interaction.reply({ embeds: [statusEmbed] });
        }
}