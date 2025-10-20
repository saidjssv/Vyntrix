const { Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            console.error(`No hay comandos con el nombre ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if(interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while tried to execute this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while tried to execute this command!',
                    flags: MessageFlags.Ephemeral,
                })
            }
        }
    }
}