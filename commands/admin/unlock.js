const { ApplicationCommandType, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: '(📌) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });

    interaction.followUp({ content: `\`[✅]\` ${interaction.member} vous venez d'accroître tous les salons.` }).then(async () => {
        interaction.guild.channels.cache.forEach(async (channel) => {
            if(channel.type === ChannelType.GuildText) {
                channel.lockPermissions();
            }

            if(channel.type === ChannelType.GuildVoice) {
                channel.lockPermissions();
            }
        })
    })
    
    }
}