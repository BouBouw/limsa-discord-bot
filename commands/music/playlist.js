const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'playlist',
    description: '(🎶) Music',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'term',
            description: 'Choix de la playlist demandée.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
execute: async (client, interaction, args, con) => {
    const input = interaction.options.getString("term");

    const { channel } = interaction.member.voice;
    if(!channel) return interaction.followUp({ content: `${interaction.member} vous n'êtes pas dans mon salon vocal.` });

    switch(input) {
        case 'hip-hop': {
            interaction.followUp({
                content: `^${interaction.member} je joue désormais la playlist **${input}**.`
            });
            break;
        }

        case 'jazz': {
            interaction.followUp({
                content: `^${interaction.member} je joue désormais la playlist **${input}**.`
            });
            break;
        }

        case 'lofi': {
            interaction.followUp({
                content: `^${interaction.member} je joue désormais la playlist **${input}**.`
            });
            break;
        }
    }
    }
}