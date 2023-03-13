const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'settings',
    description: '(⚙️) Settings',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'input',
            description: "Le type d'interaction avec la commande.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Photo de profile",
                    value: "avatar"
                },
                {
                    name: "Nom",
                    value: "username"
                },
                {
                    name: "Activité",
                    value: "activity"
                }
            ]
        },
        {
            name: 'args',
            description: "Argument de la commande.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
execute: async (client, interaction, args, con) => {
        const type = interaction.options.getString("input");
        const input = interaction.options.getString("args");

        con.query(`SELECT * FROM ownerlist`, function(err, result) {
            if(!result[0]) {
                return;
            } else {
                let list = [];
                result.forEach(async (e) => {
                    list.push(e.userID);
                })

                if(!list) return;
                if(list.includes(interaction.member.id)) {
                    switch(type) {
                        case 'avatar': {
                            if(!input && !input.endsWith('.png') && !input.endsWith('.jpg')) return interaction.followUp({ content: `\`[❓]\` ${interaction.member} vous devez fournir un lien valide.` })
                            
                            client.user.setAvatar(input).then(async () => {
                                interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'avatar de ${client.user.tag} vient d'être modifié.` });
                            })
                            break;
                        }
            
                        case 'username': {
                            if(!input && input.length > 24) return interaction.followUp({ content: `\`[❓]\` ${interaction.member} vous devez fournir un nom valide.` })
                            
                            client.user.setUsername(input).then(async () => {
                                interaction.followUp({ content: `\`[✅]\` ${interaction.member} le nom de ${client.user.tag} vient d'être modifié.` });
                            })
                            break;
                        }
            
                        case 'activity': {
                            if(!input && input.length > 24) return interaction.followUp({ content: `\`[❓]\` ${interaction.member} vous devez fournir une activité valide.` })
                            break;
                        }
                    }
                } else {
                    interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` })
                }
            }
        })
    }
}