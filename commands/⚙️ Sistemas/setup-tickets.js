const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const Ticket = require('../../Schemas/tickets');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Configura un sistema de tickets.')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild |
            PermissionFlagsBits.ManageMessages |
            PermissionFlagsBits.ManageChannels
        )
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Elige el canal donde se enviará el embed de tickets.')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('rol-de-staff')
                .setDescription('Elige el rol que tendrá acceso a los tickets.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('El mensaje que aparecerá en el embed de tickets.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal');
        const staffRole = interaction.options.getRole('rol-de-staff');
        const msg = interaction.options.getString('mensaje') ?? 'Usa el botón para abrir un ticket.';

        try {
            let cfg = await Ticket.findOne({ guildId: interaction.guild.id });

            if (!cfg) {
                cfg = new Ticket({
                    guildId: interaction.guild.id,
                    channelId: channel.id,
                    staffRoleId: staffRole.id,
                });
            } else {
                cfg.channelId = channel.id;
                cfg.staffRoleId = staffRole.id; 
            }

            await cfg.save();

            const configurandoEmbed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Configurando sistema de tickets...')
                .setDescription(`Configurando en ${channel.toString()} con rol <@&${staffRole.id}>...`)
                .setTimestamp();

            await interaction.reply({ embeds: [configurandoEmbed]});

            setTimeout(async () => {
                const configuradoEmbed = new EmbedBuilder()
    .setColor('#00FF7F')
    .setTitle('✅ | Sistema de tickets configurado correctamente')
    .setDescription(
        `🎫 | **Canal de tickets:** <#${channel.id}>\n` +
        `👥 | **Rol de staff:** <@&${staffRole.id}>\n` +
        `💬 | **Mensaje configurado:** ${msg}`
    )
    .setAuthor({ name: 'Sistema de Tickets' })
    .setTimestamp()

                await interaction.editReply({ embeds: [configuradoEmbed] });
            }, 2000);

            const ticketEmbed = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('🎫 | Sistema de Tickets')
                .setDescription(msg)
                .setTimestamp();

            const ticketRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('createTicket')
                    .setLabel('Abrir ticket')
                    .setEmoji('📨')
                    .setStyle(ButtonStyle.Primary)
            );

            await channel.send({ embeds: [ticketEmbed], components: [ticketRow] });
        } catch (err) {
            console.error('[setup-tickets] Error:', err);
            const content = 'Ocurrió un error configurando el sistema de tickets.';
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content, embeds: [] }).catch(() => {});
            } else {
                await interaction.reply({ content, ephemeral: true }).catch(() => {});
            }
        }
    }
};