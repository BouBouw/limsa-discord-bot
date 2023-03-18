const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'massive-role',
    description: '(📌) Admin',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'input',
            description: "Le type d'interaction avec la commande.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: `Ajouter`,
                    value: `add`
                },
                {
                    name: `Retirer`,
                    value: `remove`
                }
            ]
        },
        {
            name: `role`,
            description: `Rôle à attribuer.`,
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });
    
    const type = interaction.options.getString('input');
    const role = interaction.options.getRole('role');

    let counter = 0;

    switch(type) {
        case 'add': {
            const members = await interaction.guild.members.fetch();

            for await (const [, member] of members) {
                await member.roles.add(role);
                await sleep(2500);

                counter = Math.floor(counter + 1);
            }

            interaction.followUp({ content: `\`[✅]\` ${interaction.member} le rôle ${role} à bien été ajouter à tous les membres (**${counter}**).` });
            break;
        }

        case 'remove': {
            const members = await interaction.guild.members.fetch();

            for await (const [, member] of members) {
                await member.roles.remove(role);
                await sleep(2500);

                counter = Math.floor(counter + 1);
            }

            interaction.followUp({ content: `\`[✅]\` ${interaction.member} le rôle ${role} à bien été retirer à tous les membres.` });
            break;
        }
    }
    
    }
}