const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: '(🔧) Mods',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'member',
            description: 'Membre à unmute',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });

    const target = interaction.options.getMember('member');
    if(target.id === interaction.member.id) return interaction.followUp({ content: `\`[❌]\` ${interaction.member} vous ne pouvez pas vous rendre la parole.` })

    target.timeout(null).then(async () => {
        interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** n'est plus muet.` })
    })

    }
}