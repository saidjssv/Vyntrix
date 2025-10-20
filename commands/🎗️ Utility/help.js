const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Ventana de ayuda para que sepas que comandos tiene el bot y sus funciones'),
    async execute(interaction) {
        const commandsPath = path.join(__dirname, '..');
        const categories = fs.readdirSync(commandsPath).filter(file => fs.statSync(path.join(commandsPath, file)).isDirectory());

        const helpEmbed = new EmbedBuilder()
            .setTitle('🙏 | Ayuda')
            .setDescription(`**¡Bienvenido ${interaction.user.tag}!**\nEsta es una pequeña ventana de ayuda para que sepas qué comandos tiene el bot y cómo usarlos. **Para revisar los comandos de la categoría que desees abre el menu de selección** \n\n **📈 | Estadísticas: ** \n > Servers: ${interaction.client.guilds.cache.size} \n\n **‼️ | ¿Encontraste algún problema con el bot? Avisa a: <@1185786435933065276>** \n\n [Servidor de soporte](https://discord.gg/FK44yEREnM)`)
            .setColor('Green')
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const options = [
            {
                label: '🏠 Inicio',
                value: 'all',
                description: 'Inicio del embed'
            },
            ...categories.map(category => ({
                label: category,
                value: category, 
            }))
        ];

        const select = new StringSelectMenuBuilder()
            .setCustomId('help_select_category')
            .setPlaceholder('Selecciona una categoría')
            .setOptions(options);

        const row = new ActionRowBuilder().addComponents(select);

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            const commandFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
            if (commandFiles.length === 0) continue;

            const list = commandFiles.map(file => {
                try {
                    const cmd = require(path.join(categoryPath, file));
                    delete require.cache[require.resolve(path.join(categoryPath, file))];

                    const name = cmd?.data?.name || file.replace('.js', '');
                    const desc = cmd?.data?.description || 'Sin descripción';
                    return `\`${name}\` — ${desc}`;
                } catch (err) {
                    return `\`${file.replace('.js', '')}\` — error al cargar`;
                }
            }).join('\n');
        }


        const replyMessage = await interaction.reply({ embeds: [helpEmbed], components: [row], fetchReply: true});

        const filter = i => i.isStringSelectMenu() && i.customId === 'help_select_category' && i.user.id === interaction.user.id;
        const collector = replyMessage.createMessageComponentCollector({ filter, time: 240000 });

        collector.on('collect', async selectInteraction => {
            try {
                const selected = selectInteraction.values[0];

                if (selected === 'all') {
                    await selectInteraction.update({ embeds: [helpEmbed], components: [row] });
                    return;
                }

                
                const category = selected;
                const categoryPath = path.join(commandsPath, category);
                const commandFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

                const categoryEmbed = new EmbedBuilder()
                    .setTitle(`Ayuda — ${category}`)
                    .setDescription(`Comandos de la categoría **${category}**`)
                    .setColor('Green')
                    .setTimestamp();

                const list = commandFiles.map(file => {
                    try {
                        const cmd = require(path.join(categoryPath, file));
                        delete require.cache[require.resolve(path.join(categoryPath, file))];

                        const name = cmd?.data?.name || file.replace('.js', '');
                        const desc = cmd?.data?.description || 'Sin descripción';
                        return `\`${name}\` — ${desc}`;
                    } catch (err) {
                        return `\`${file.replace('.js', '')}\` — error al cargar`;
                    }
                }).join('\n') || 'Sin comandos en esta categoría';

                categoryEmbed.addFields({ name: category, value: list, inline: false });

                await selectInteraction.update({ embeds: [categoryEmbed], components: [row] });
            } catch (err) {
                console.error('Error handling help select:', err);
            }
        });

        collector.on('end', async () => {
            try {
                const disabledSelect = StringSelectMenuBuilder.from(select).setDisabled(true);
                const disabledRow = new ActionRowBuilder().addComponents(disabledSelect);
                await interaction.editReply({ components: [disabledRow] });
            } catch (err) {
                
            }
        });
    }
}