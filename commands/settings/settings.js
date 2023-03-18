const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

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
                            
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('online')
                                        .setEmoji('🟢')
                                        .setLabel('En ligne')
                                        .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                        .setCustomId('idle')
                                        .setEmoji('🟠')
                                        .setLabel('Inactif')
                                        .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                        .setCustomId('dnd')
                                        .setEmoji('🔴')
                                        .setLabel('Ne pas déranger')
                                        .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                        .setCustomId('offline')
                                        .setEmoji('⚫')
                                        .setLabel('Hors-ligne')
                                        .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                        .setCustomId('streaming')
                                        .setEmoji('🟣')
                                        .setLabel('Streaming')
                                        .setStyle(ButtonStyle.Secondary),
                                )

                            interaction.followUp({
                                embeds: [{
                                    color: Colors.Purple,
                                    title: `Activité`,
                                    fields: [
                                        {
                                            name: "`[🟢]` En ligne",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[🟠]` Inactif",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[🔴]` Ne pas déranger",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[⚫]` Hors-ligne",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[🟣]` Streaming",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                    ]
                                }],
                                components: [ row ]
                            }).then(async (msg) => {
                                const filter = (interaction) => interaction.user.id === interaction.member.id && interaction.isButton();
                                await Buttons();

                                async function Buttons() {
                                    let collected;
                                    try {
                                        collected = await msg.awaitMessageComponent({ filter: filter, time: 0 });
                                    } catch(err) {
                                        if(err.code === 'INTERACTION_COLLECTOR_ERROR') {
                                            return msg.delete();
                                        }
                                    }

                                    if(!collected.deffered) await collected.deferUpdate();

                                    switch(collected.customId) {
                                        case 'online': {
                                            con.query(`SELECT * FROM settings`, function(err, result) {
                                                if(!result) return;

                                                con.query(`UPDATE settings SET activities_status = '${collected.customId}' WHERE activities_status = '${result[0].activities_status}'`, function(err, res) {
                                                    con.query(`UPDATE settings SET activities_text = '${input}' WHERE activities_text = '${result[0].activities_text}'`, function(err, res_1) {
                                                        con.query(`UPDATE settings SET activities_type = 'watching' WHERE activities_type = '${result[0].activities_type}'`, function(err, res) {
                                                            msg.edit({
                                                                content: `\`[✅]\` ${interaction.member} l'activité de ${client.user.tag} vient d'être modifié.`,
                                                                embeds: [],
                                                                components: []
                                                            }).then(async () => {
                                                                await process.exit(0);
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                            break;
                                        }

                                        case 'idle': {
                                            con.query(`SELECT * FROM settings`, function(err, result) {
                                                if(!result) return;

                                                con.query(`UPDATE settings SET activities_status = '${collected.customId}' WHERE activities_status = '${result[0].activities_status}'`, function(err, res) {
                                                    con.query(`UPDATE settings SET activities_text = '${input}' WHERE activities_text = '${result[0].activities_text}'`, function(err, res_1) {
                                                        con.query(`UPDATE settings SET activities_type = 'watching' WHERE activities_type = '${result[0].activities_type}'`, function(err, res) {
                                                            msg.edit({
                                                                content: `\`[✅]\` ${interaction.member} l'activité de ${client.user.tag} vient d'être modifié.`,
                                                                embeds: [],
                                                                components: []
                                                            }).then(async () => {
                                                                await process.exit(0);
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                            break;
                                        }

                                        case 'dnd': {
                                            con.query(`SELECT * FROM settings`, function(err, result) {
                                                if(!result) return;

                                                con.query(`UPDATE settings SET activities_status = '${collected.customId}' WHERE activities_status = '${result[0].activities_status}'`, function(err, res) {
                                                    con.query(`UPDATE settings SET activities_text = '${input}' WHERE activities_text = '${result[0].activities_text}'`, function(err, res_1) {
                                                        con.query(`UPDATE settings SET activities_type = 'watching' WHERE activities_type = '${result[0].activities_type}'`, function(err, res) {
                                                            msg.edit({
                                                                content: `\`[✅]\` ${interaction.member} l'activité de ${client.user.tag} vient d'être modifié.`,
                                                                embeds: [],
                                                                components: []
                                                            }).then(async () => {
                                                                await process.exit(0);
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                            break;
                                        }

                                        case 'offline': {
                                            con.query(`SELECT * FROM settings`, function(err, result) {
                                                if(!result) return;

                                                con.query(`UPDATE settings SET activities_status = '${collected.customId}' WHERE activities_status = '${result[0].activities_status}'`, function(err, res) {
                                                    con.query(`UPDATE settings SET activities_text = '${input}' WHERE activities_text = '${result[0].activities_text}'`, function(err, res_1) {
                                                        con.query(`UPDATE settings SET activities_type = 'watching' WHERE activities_type = '${result[0].activities_type}'`, function(err, res) {
                                                            msg.edit({
                                                                content: `\`[✅]\` ${interaction.member} l'activité de ${client.user.tag} vient d'être modifié.`,
                                                                embeds: [],
                                                                components: []
                                                            }).then(async () => {
                                                                await process.exit(0);
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                            break;
                                        }

                                        case 'streaming': {
                                            con.query(`SELECT * FROM settings`, function(err, result) {
                                                if(!result) return;

                                                con.query(`UPDATE settings SET activities_type = '${collected.customId}' WHERE activities_type = '${result[0].activities_type}'`, function(err, res) {
                                                    con.query(`UPDATE settings SET activities_text = '${input}' WHERE activities_text = '${result[0].activities_text}'`, function(err, res_1) {
                                                        msg.edit({
                                                            content: `\`[✅]\` ${interaction.member} l'activité de ${client.user.tag} vient d'être modifié.`,
                                                            embeds: [],
                                                            components: []
                                                        }).then(async () => {
                                                            await process.exit(0);
                                                        })
                                                    })
                                                })
                                            })
                                            break;
                                        }
                                    }
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