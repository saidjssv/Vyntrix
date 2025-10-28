const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-colorroles')
        .setDescription ('Crea roles de colores predefinidos para el servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
        async execute(interaction) {

            await interaction.deferReply({ content: 'Creando roles de colores...'});

            const palette = [
            { name: 'Rojo', color: 0xE74C3C },
            { name: 'Verde', color: 0x2ECC71 },
            { name: 'Azul', color: 0x3498DB },
            { name: 'Amarillo', color: 0xF1C40F },
            { name: 'Naranja', color: 0xE67E22 },
            { name: 'Morado', color: 0x9B59B6 },
            { name: 'Blanco', color: 0xFFFFFF },
            { name: 'Negro', color: 0x000000 },
            { name: 'Rosa', color: 0xFF69B4 },
        ];

            const created = [];
            const skipped = [];
            const failed = [];

            await Promise.all(palette.map(async ({name, color}) => {
                const exists = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === name.toLowerCase());

                if(exists) {
                    skipped.push(name);
                    return;
                }

                try {
                    const role = await interaction.guild.roles.create({
                        name,
                        color,
                        mentionable: true,
                    });
                    created.push(name);
                } catch {
                    failed.push(name);
                } 
            } ));

            const rolesEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🎨 | Creación de roles de colores completada')
                .setDescription([
                created.length ? `✅ **Creados**: \`${created.join(', ')}\`` : null,
                skipped.length ? `⚠️ **Omitidos** (ya existían): \`${skipped.join(', ')}\`` : null,
                failed.length ? `❌ **Fallidos**: \`${failed.join(', ')}\`` : null,
            ].filter(Boolean).join('\n'))
                .setTimestamp()

                await interaction.editReply({ embeds: [rolesEmbed] })

        }
}