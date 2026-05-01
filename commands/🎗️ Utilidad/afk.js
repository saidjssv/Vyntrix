const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const afk = require('../../Schemas/afkSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Marca tu estado como AFK y el motivo de tu ausencia')
    .addStringOption(option => 
        option.setName('motivo')
        .setDescription('El motivo por el cual estás ausente')
        .setRequired(false)
    ),

    async execute(interaction) {
        const motivo = interaction.options.getString('motivo') ?? 'No especificado';

        const afkEmbed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle('💤 | AFK')
        .setDescription(`Tu estado ha sido marcado como ausente. \nMotivo: ${motivo}`)
        .setTimestamp();

        await afk.findOneAndUpdate(
            { guildId: interaction.guildId, userId: interaction.user.id },
            {
                $set: { motivo, timestamp: new Date() },
                $setOnInsert: { guildId: interaction.guildId, userId: interaction.user.id }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await interaction.reply({ embeds: [afkEmbed] });
    }

}