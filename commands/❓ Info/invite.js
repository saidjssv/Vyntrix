const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invita al bot a tu servidor!'),
        async execute(interaction) {

            const inviteEmbed = new EmbedBuilder()
            .setTitle('Invita a Vyntrix a tu servidor!')
            .setDescription('Muchas gracias por considerar invitar a **Vyntrix** a tu servidor. ¡Haz clic en el botón para invitarlo!')
            .setColor('Purple')
            .setTimestamp()

            const inviteButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invitar a Vyntrix')
                    .setStyle(5)
                    .setURL('https://discord.com/oauth2/authorize?client_id=1381084085279133828&permissions=8&integration_type=0&scope=bot+applications.commands')
            );

            await interaction.reply({ embeds: [inviteEmbed], components: [inviteButton] });
        }
}