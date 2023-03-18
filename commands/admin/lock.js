const { ApplicationCommandType, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    name: 'lock',
    description: '(📌) Admin',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });

    interaction.followUp({ content: `\`[✅]\` ${interaction.member} vous venez de restreindre tous les salons.` }).then(async () => {
        interaction.guild.channels.cache.forEach(async (channel) => {
            if(channel.type === ChannelType.GuildText) {
                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [ PermissionsBitField.Flags.SendMessages ]
                    }
                ])
            }

            if(channel.type === ChannelType.GuildVoice) {
                channel.members.forEach((member) => {
                    member.voice.disconnect();
                })

                setTimeout(async () => {
                    channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [ PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak ]
                        }
                    ])
                }, 5000)
            }
        })
    })

    }
}