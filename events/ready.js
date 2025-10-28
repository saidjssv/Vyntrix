const { Events } = require('discord.js');
const { dbc } = require('../config/config.json');
const mongoose = require('mongoose');
let colors = require('colors')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(colors.blue(`------------- CLIENT -------------`));
        console.log(colors.green(`Logged in as ${client.user.tag}`));

        try {
            console.log(colors.blue('------------- DATABASE -------------'))
            console.log(colors.yellow('Connecting to the database...'));
            await mongoose.connect(dbc)
            console.log(colors.green('Connected to the database.'));
            console.log(colors.blue('------------------------------------'))
        } catch(error) {
            console.log(colors.red(error));
        }

        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        const activities = [
            { name: 'Beabadoobee', type: 2 },
            { name: `${client.guilds.cache.size} servidores`, type: 3 },
            { name: `a ${totalMembers.toLocaleString()} usuarios`, type: 3 },
            { name: 'Desarrollado por: sadvxz', type: 5 },
            { name: 'Pornhub.com', type: 3 }
        ];

        let currentActivity = 0;


        try {
            await client.user.setPresence({
                activities: [activities[currentActivity]],
                status: 'idle'
            });
        } catch(e) {
            console.log(colors.red('Se detecto un error en la presencia del bot: ' + e));
        }

        setInterval(async () => {
            currentActivity = (currentActivity + 1) % activities.length;
            try {
                await client.user.setPresence({
                    activities: [activities[currentActivity]],
                    status: 'idle'
                });
            } catch(e) {
                console.log(colors.red('Error actualizando presencia: ' + e));
            }
        }, 15000);
    }
}