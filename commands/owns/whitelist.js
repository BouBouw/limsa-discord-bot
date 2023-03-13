const { ApplicationCommandType, ApplicationCommandOptionType, Colors } = require('discord.js');

module.exports = {
    name: 'whitelist',
    description: '(👑) Owns',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'input',
            description: "Le type d'interaction avec la commande.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Liste',
                    value: 'list'
                },
                {
                    name: 'Ajouter',
                    value: 'add'
                },
                {
                    name: 'Retirer',
                    value: 'remove'
                },
                {
                    name: 'Réinitialiser',
                    value: 'reset'
                }
            ]
        },
        {
            name: 'member',
            description: "Selection du membre concerner.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    execute: async (client, interaction, args, con) => {
        const type = interaction.options.getString("input");
        const target = interaction.options.getMember("member");

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
                        case 'list': {
                            interaction.followUp({
                                embeds: [{
                                    color: Colors.Purple,
                                    title: "Liste blanche :",
                                    description: `> **__Chargement des données...__**`,
                                    footer: {
                                        text: "0/0"
                                    }
                                }]
                            }).then(async (msg) => {
                                con.query(`SELECT * FROM whitelist`, function(err, result) {
                                    if(err) return interaction.channel.send({ content: `ERROR` });
            
                                    if(!result[0]) {
                                        return msg.edit({
                                            embeds: [{
                                                color: Colors.Purple,
                                                title: "Liste blanche :",
                                                description: `> **__Aucun membre dans la liste blanche__**`,
                                                footer: {
                                                    text: "0/0"
                                                }
                                            }]
                                        })
                                    } else {
                                        let list = [];
                                        result.forEach(async (e) => {
                                            const member = interaction.guild.members.cache.get(e.userID);
                                            list.push(`**${member.user.tag}** (\`${member.user.id}\`)`);
                                        })
            
                                        return msg.edit({
                                            embeds: [{
                                                color: Colors.Purple,
                                                title: "Liste blanche :",
                                                description: `${list.join('\n')}`,
                                                footer: {
                                                    text: "1/1"
                                                }
                                            }]
                                        })
                                    }
                                })
                            })
                            break;
                        }
            
                        case 'add': {
                            if(!target) {
                                interaction.followUp({ content: `\`[❓]\` ${interaction.member} vous devez utilisé l'argument \`member\`.` })
                            } else {
                                con.query(`SELECT * FROM whitelist WHERE userID = '${target.user.id}'`, function(err, result) {
                                    if(!result[0]) {
                                        con.query(`INSERT INTO whitelist (userID) VALUES ('${target.user.id}')`, function(err, result) {
                                            if(err) return interaction.channel.send({ content: `ERROR` });
                    
                                            interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** à correctement été ajoutée a la liste blanche.` })
                                        })
                                    } else {
                                        interaction.followUp({ content: `\`[❌]\` ${interaction.member} l'utilisateur **${target.user.tag}** est déjà dans la liste blanche.` })
                                    }
                                })
                            }
                            break;
                        }
            
                        case 'remove': {
                            if(!target) {
                                interaction.followUp({ content: `\`[❓]\` ${interaction.member} vous devez utilisé l'argument \`member\`.` })
                            } else {
                                con.query(`SELECT * FROM whitelist WHERE userID = '${target.user.id}'`, function(err, result) {
                                    if(!result[0]) {
                                        interaction.followUp({ content: `\`[❌]\` ${interaction.member} l'utilisateur **${target.user.tag}** n'est pas dans la liste blanche.` })
                                    } else {
                                        con.query(`DELETE FROM whitelist WHERE userID = '${target.user.id}'`, function(err, result) {
                                            interaction.followUp({ content: `\`[✅]\` ${interaction.member} l'utilisateur **${target.user.tag}** à correctement été retirer de la liste blanche.` })
                                        })
                                    }
                                })
                            }
                            break;
                        }
            
                        case 'reset': {
                            con.query(`SELECT * FROM whitelist WHERE userID = '${target.user.id}'`, function(err, result) {
                                if(!result[0]) {
                                    interaction.followUp({ content: `\`[❌]\` ${interaction.member} aucun utilisateur n'est dans la liste blanche.` })
                                } else {
                                    con.query(`DROP TABLE whitelist`, function(err, result) {
                                        interaction.followUp({ content: `\`[✅]\` ${interaction.member} la liste blanche à correctement été réinitialisée.` })
                                    })
                                }
                            })
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