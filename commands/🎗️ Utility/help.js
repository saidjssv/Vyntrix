const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Ventana interactiva de ayuda para ver todos los comandos y sus funciones'),
    
    async execute(interaction) {
        const commandsPath = path.join(__dirname, '..');
        const categories = fs.readdirSync(commandsPath).filter(file =>
            fs.statSync(path.join(commandsPath, file)).isDirectory()
        );

        const helpEmbed = new EmbedBuilder()
            .setTitle('🙏 | Centro de Ayuda')
            .setDescription(`
👋 **¡Bienvenido, ${interaction.user.username}!**
Aquí podrás explorar todos los comandos del bot de forma sencilla.

🔽 **Cómo usar:**
> Selecciona una categoría en el menú de abajo para ver sus comandos.

📊 **Estadísticas del bot:**
> 🌐 Servidores: **${interaction.client.guilds.cache.size}**
> 👤 Usuario actual: **${interaction.user.tag}**

🧩 **Consejos útiles:**
> • Usa \`/\` para abrir el menú de comandos.  
> • Si un comando no responde, revisa tus permisos o intenta nuevamente.  
> • Algunos comandos pueden tener alias o estar en mantenimiento.

📨 **Soporte:**
> ¿Encontraste un error o tienes una sugerencia?  
> Contacta a: <@1185786435933065276>  
> 🔗 [Servidor de soporte](https://discord.gg/FK44yEREnM)
`)
            .setColor('Green')
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const options = [
            {
                label: '🏠 Inicio',
                value: 'all',
                description: 'Volver al menú principal de ayuda'
            },
            ...categories.map(category => ({
                label: category,
                value: category,
                description: `Ver comandos de la categoría ${category}`
            }))
        ];

        const select = new StringSelectMenuBuilder()
            .setCustomId('help_select_category')
            .setPlaceholder('Selecciona una categoría...')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(select);

        const replyMessage = await interaction.reply({ 
            embeds: [helpEmbed], 
            components: [row], 
            fetchReply: true 
        });

        const filter = i => 
            i.isStringSelectMenu() && 
            i.customId === 'help_select_category' && 
            i.user.id === interaction.user.id;

        const collector = replyMessage.createMessageComponentCollector({ filter, time: 240000 });

        const commandsByCategory = {};
        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            const commandFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

            const list = commandFiles.map(file => {
                try {
                    const cmd = require(path.join(categoryPath, file));
                    const name = cmd?.data?.name || file.replace('.js', '');
                    const desc = cmd?.data?.description || 'Sin descripción';
                    return `> \`/${name}\` — ${desc}`;
                } catch (err) {
                    return `> \`${file.replace('.js', '')}\` — ⚠️ Error al cargar`;
                }
            }).join('\n') || 'Sin comandos en esta categoría';

            commandsByCategory[category] = list;
        }

        collector.on('collect', async selectInteraction => {
            try {
                const selected = selectInteraction.values[0];

                if (selected === 'all') {
                    await selectInteraction.update({ embeds: [helpEmbed], components: [row] });
                    return;
                }

                const categoryEmbed = new EmbedBuilder()
                    .setTitle(`📂 | Categoría: ${selected}`)
                    .setDescription(commandsByCategory[selected] || 'Sin comandos disponibles.')
                    .setColor('Green')
                    .setTimestamp()
                    .setFooter({ text: 'Usa /help o selecciona "Inicio" para volver al inicio' });

                await selectInteraction.update({ embeds: [categoryEmbed], components: [row] });
            } catch (err) {
                console.error('Error handling help select:', err);
            }
        });

        collector.on('end', async () => {
            try {
                const disabledSelect = StringSelectMenuBuilder.from(select).setDisabled(true);
                const disabledRow = new ActionRowBuilder().addComponents(disabledSelect);

                await interaction.editReply({
                    content: '⏳ El menú de ayuda ha expirado. Usa `/help` nuevamente para abrirlo otra vez.',
                    components: [disabledRow]
                });
            } catch (err) {
                console.error('Error al finalizar collector:', err);
            }
        });
    }
};
