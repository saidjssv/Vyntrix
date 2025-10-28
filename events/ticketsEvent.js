const { Events, ChannelType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../Schemas/tickets');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'createTicket') {
            await interaction.deferReply({ ephemeral: true });

            const cfg = await Ticket.findOne({ guildId: interaction.guild.id }).catch(() => null);
            if (!cfg) {
                return interaction.editReply('No hay configuración de tickets. Usa /setup-tickets primero.');
            }

            const existing = interaction.guild.channels.cache.find(
                c => c.type === ChannelType.GuildText && c.topic === `ticket: ${interaction.user.id}`
            );
            if (existing) {
                return interaction.editReply(`Ya tienes un ticket abierto: ${existing.toString()}`);
            }

            const me = interaction.guild.members.me;
            const needed = [
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory
            ];
            if (!me.permissions.has(needed)) {
                return interaction.editReply('No tengo permisos suficientes (ManageChannels, ViewChannel, SendMessages, EmbedLinks, ReadMessageHistory).');
            }

            const everyone = interaction.guild.roles.everyone;

            const overwrites = [
                { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.EmbedLinks
                    ]
                },
                {
                    id: cfg.staffRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageChannels
                    ]
                }
            ];

            const name = `ticket-${interaction.user.username}`

            const channel = await interaction.guild.channels.create({
                name,
                type: ChannelType.GuildText,
                topic: `ticket: ${interaction.user.id}`,
                permissionOverwrites: overwrites,

                reason: `Ticket creado por ${interaction.user.tag}`
            });

            const embed = new EmbedBuilder()
    .setColor('#0099FF') // Azul vibrante
    .setTitle('🎫 ¡Ticket abierto exitosamente!')
    .setDescription(
        `> 👋 **Bienvenido a tu ticket**, ${interaction.user}!\n` +
        `> 🕐 Por favor, **espera a que un miembro del staff te atienda.**\n\n` +
        `⚠️ Mientras tanto, evita mencionar al staff repetidamente.\n` +
        `Gracias por tu paciencia 💙`
    )
    .setTimestamp()

            const closeRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Cerrar ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({ content: `<@&${cfg.staffRoleId}> ${interaction.user}`, embeds: [embed], components: [closeRow] });
            await interaction.editReply(`Tu ticket ha sido creado: ${channel.toString()}`);
            return;
        }


        if (interaction.customId === 'closeTicket') {
            const ch = interaction.channel;
            if (ch.type !== ChannelType.GuildText || !ch.topic?.startsWith('ticket:')) {
                return interaction.reply({ content: 'Este canal no es un ticket.', ephemeral: true });
            }
            await interaction.reply({ content: 'Cerrando ticket en 5 segundos...', ephemeral: true });
            setTimeout(() => ch.delete('Ticket cerrado'), 5000);
        }
    }
};