const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('te responde pong y ya'),
    async execute(interaction) {

        const client = interaction.client;
        
        const pong = new EmbedBuilder()
        .setTitle('🏓 | Pong!')
        .setDescription(`> **Mi ping actual es de:** ${client.ws.ping}`)
        .setColor('Blue')
        .setTimestamp()
        
        interaction.reply({ embeds: [pong] });
    }
}