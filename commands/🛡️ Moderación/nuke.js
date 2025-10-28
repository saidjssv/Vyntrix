const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Elimina el canal actual y crea uno nuevo con la misma configuración.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.channel;
        
        if (!channel.deletable) {
            return interaction.reply({ content: 'No puedo eliminar este canal.', ephemeral: true });
        }

        const confirmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('❗ | Esperando confirmación')
            .setDescription('¿Estás totalmente seguro de nukear este canal? Si es así, presiona el botón de abajo.')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirmNuke')
                    .setLabel('Confirmar')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancelNuke')
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Secondary)
            );

        const message = await interaction.reply({ embeds: [confirmEmbed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Solo quien ejecutó el comando puede usar estos botones.', ephemeral: true });
            }

            if (i.customId === 'confirmNuke') {
                await i.update({ content: 'Nukeando canal... 💥', embeds: [], components: [] });

                setTimeout(async () => {
                    const clone = await channel.clone({
                        name: channel.name,
                        reason: `Nuke solicitado por ${interaction.user.tag}`
                    });

                    await channel.delete();

                    const nukedEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle('💥 | Canal nukeado exitosamente')
                        .setDescription(`El canal ha sido nukeado por ${interaction.user}.`)
                        .setTimestamp();

                    await clone.send({ embeds: [nukedEmbed] });
                }, 3000);

                collector.stop();
            } else if (i.customId === 'cancelNuke') {
                const cancelEmbed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('❎ | Nuke cancelado')
                    .setDescription('El nuke del canal ha sido cancelado.')
                    .setTimestamp();

                await i.update({ embeds: [cancelEmbed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Tiempo agotado. Nuke cancelado.', embeds: [], components: [] }).catch(() => {});
            }
        });
    }
};