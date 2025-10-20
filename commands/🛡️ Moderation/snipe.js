const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Snipe = require('../../Schemas/snipeSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Snipe commands for moderation')
        .setDefaultMemberPermissions(PermissionFlagsBits.GuildMessageManager),
    async execute(interaction) {
        let data = await Snipe.findOne({ channelId: interaction.channel.id });

        const noData = new EmbedBuilder()
            .setTitle('No se pudo ejecutar el comando.')
            .setDescription('No hay mensajes borrados por el momento.')
            .setColor('Red')
            .setTimestamp()

        if(!data) {
            return interaction.reply({embeds: [noData], ephemeral: true});
        } else {
            const SnipeEmbed = new EmbedBuilder()
                .setTitle(`Snipe!`)
                .setDescription(`> __**Autor:**__ <@${data.userId}> \n > __**Contenido del mensaje:**__ **${data.msg}** \n > __**Borrado hace:**__ <t:${data.date}:R>`)
                .setColor('Blue')
                .setTimestamp()

            interaction.reply({embeds: [SnipeEmbed] });
        }

    }
}