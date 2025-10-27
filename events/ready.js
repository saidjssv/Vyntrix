const { Events } = require('discord.js');
const { dbc } = require('../config/config.json');
const mongoose = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`------------- CLIENT -------------`);
        console.log(`Logged in as ${client.user.tag}`);

        try {
            console.log('------------- DATABASE -------------')
            console.log('Connecting to the database...');
            await mongoose.connect(dbc)
            console.log('Connected to the database.');
            console.log('------------------------------------')
        } catch(error) {
            console.log(error);
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
            console.log('Se detecto un error en la presencia del bot: ' + e);
        }

        setInterval(async () => {
            currentActivity = (currentActivity + 1) % activities.length;
            try {
                await client.user.setPresence({
                    activities: [activities[currentActivity]],
                    status: 'idle'
                });
            } catch(e) {
                console.log('Error actualizando presencia: ' + e);
            }
        }, 15000);
    }
}