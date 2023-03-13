const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'ping',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
    execute: async (client, interaction, args, con) => {
        interaction.followUp({ content: `\`[🏓]\` ${interaction.member} pong!` })
    }
}