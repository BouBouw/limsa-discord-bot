const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'clear',
    description: '(🔧) Mods',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "count",
            description: "Nombre de messages à supprimer",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });

    const count = interaction.options.getNumber("count");

    if(isNaN(count) && !Number(count) || Number(count) > 99) return interaction.followUp({ content: `\`[❌]\` ${interaction.member} veuillez fournir un nombre valide.` })

    await interaction.channel.bulkDelete(Math.floor(count + 1), true).then(async () => {
        return interaction.channel.send({ content: `\`[✅]\` ${interaction.member} vous venez de supprimer **${count} messages**.` });
    })
    }
}