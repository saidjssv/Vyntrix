const { Events, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const dbc = process.env.DATABASE;
const testGuildId = process.env.TEST_GUILD_ID;
const mongoose = require("mongoose");
let colors = require("colors");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(colors.blue(`------------- CLIENT -------------`));
        console.log(colors.green(`Logged in as ${client.user.tag}`));

        try {
            console.log(colors.blue("------------- DATABASE -------------"));
            console.log(colors.yellow("Connecting to the database..."));
            await mongoose.connect(dbc);
            console.log(colors.green("Connected to the database."));
            console.log(colors.blue("------------------------------------"));
        } catch (error) {
            console.log(colors.red(error));
        }

        const totalMembers = client.guilds.cache.reduce(
            (acc, guild) => acc + guild.memberCount,
            0
        );

        const activities = [
            { name: "Escuchando: Talk - Beabadoobee", type: 2 },
            {
                name: `Administrando a ${client.guilds.cache.size} servidores`,
                type: 3,
            },
            { name: `Ayudando a ${totalMembers.toLocaleString()} usuarios`, type: 3 },
            { name: "Desarrollado por: sadvxz", type: 5 },
            { name: "Viendo: E-girls en medias empapadas", type: 3 },
        ];

        let currentActivity = 0;

        try {
            await client.user.setPresence({
                activities: [activities[currentActivity]],
                status: "idle",
            });
        } catch (e) {
            console.log(
                colors.red("Se detecto un error en la presencia del bot: " + e)
            );
        }

        setInterval(async () => {
            currentActivity = (currentActivity + 1) % activities.length;
            try {
                await client.user.setPresence({
                    activities: [activities[currentActivity]],
                    status: "idle",
                });
            } catch (e) {
                console.log(colors.red("Error actualizando presencia: " + e));
            }
        }, 15000);

        const statusChannel = await client.channels.fetch(testGuildId);
        const now = new Date().toLocaleString("es-ES", {
            timeZone: "America/Mexico_City",
        });

        const statusEmbed = new EmbedBuilder()
            .setTitle("🔄 ¡Bot reiniciado!")
            .setDescription(
                `
✅ **Estado:** Reinicio completado correctamente
────────────────────────
🕒 **Hora del reinicio:** \`${now}\`
⚡ **Listo para volver a la acción!**
────────────────────────
`
            )
            .setColor("#00FF7F")
            .setTimestamp()
            .setFooter({ text: "Sistema de Bot | Vyntrix 🚀" });

        statusChannel.send({ embeds: [statusEmbed] });

        process.on("uncaughtException", async (err) => {
            const errorEmbed = new EmbedBuilder()
                .setTitle("❌ ¡Error crítico detectado!")
                .setDescription(
                    `
⚠️ **Tipo:** Uncaught Exception
────────────────────────
💻 **Stack trace:**
\`\`\`
${err.stack}
\`\`\`
────────────────────────
🛠️ Revisa el log y corrige el problema lo antes posible.
`
                )
                .setColor("#FF4C4C")
                .setTimestamp()
                .setFooter({ text: "Sistema de Bot | Vyntrix 🚨" });

            const statusChannel = await client.channels.fetch(testGuildId);
            statusChannel.send({ embeds: [errorEmbed] });
        });
    },
};
