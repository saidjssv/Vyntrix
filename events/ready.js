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
    }
}