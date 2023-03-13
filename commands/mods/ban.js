const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: '(🔧) Mods',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'member',
            description: "Membre a bannir.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: "Raison du bannissement.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` })

    const target = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason');

    if(target.member.id === interaction.member.id) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous ne pouvez pas vous bannir vous même.` })

    target.ban({ reason: `${reason ? `${interaction.user.tag} | ${reason}.` : `${interaction.user.tag} | Aucune raison fournie.`}` }).then(async () => {
        interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** vient d'être banni.` });
    })
    .catch((err) => {
        interaction.followUp({ content: `\`[❌]\` ${interaction.member} l'utilisateur **${target.user.tag}** ne peut être banni.` })
    })
    }
}