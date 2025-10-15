const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banana')
        .setDescription('Want to know how long is yo banana?'),
        async execute(interaction) {
            let banana = Math.floor(Math.random() * 100);

            const bananaEmbed = new EmbedBuilder()
                .setTitle('🍆 | Omg')
                .setDescription(`Omfg, tu banana mide: ${banana}, que puta pequeña que es`)
                .setColor('Blue')
                .setTimestamp()

            interaction.reply({ embeds: [bananaEmbed] });
        }
}