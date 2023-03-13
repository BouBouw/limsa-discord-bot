const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    description: '(🔧) Mods',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'member',
            description: "Membre a expulser.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: "Raison de l'expulsion.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` })

    const target = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

    if(target.member.id === interaction.member.id) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous ne pouvez pas vous expulser vous même.` })

    target.kick({ reason: `${reason ? `${interaction.user.tag} | ${reason}.` : `${interaction.user.tag} | Aucune raison fournie.`}` }).then(async () => {
        interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** vient d'être expulser.` });
    })
    .catch((err) => {
        interaction.followUp({ content: `\`[❌]\` ${interaction.member} l'utilisateur **${target.user.tag}** ne peut être expulser.` })
    })
    }
}