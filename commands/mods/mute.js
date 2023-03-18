const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: '(🔧) Mods',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'member',
            description: "Membre a rendre muet.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'time',
            description: "Temps du mute.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: "Raison du mute.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });

    const target = interaction.options.getMember('member');
    const time = ms(interaction.options.getString('time'));
    const reason = interaction.options.getString('reason');

    if(target.member.id === interaction.member.id) return interaction.followUp({ content: `\`[❌]\` ${interaction.member} vous ne pouvez pas vous rendre muet vous-même.` });
    if(time > 2419200000 || time < 10000) return interaction.followUp({ content: `\`[❌]\` ${interaction.member} veuillez fournir une durée valide.` });
    if(target.isCommunicationDisabled()) return interaction.followUp({ content: `\`[❌]\` ${interaction.member} l'utilisateur ${target} est déjà muet.` })

    target.disableCommunicationUntil(Date.now() + (time), `${reason ? `${interaction.user.tag} | ${reason}.` : `${interaction.user.tag} | Aucune raison fournie.` }`).then(async () => {
        interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** vient d'être rendu muet.` });
    })
    }
}