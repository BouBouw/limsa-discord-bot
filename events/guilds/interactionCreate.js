const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');
const ms2 = require('parse-ms');

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await giveawaysModal();
    await giveawaysButton();
    await modmailButton();

    async function giveawaysModal() {
        if(!interaction.isModalSubmit()) return;

        switch(interaction.customId) {
            case 'giveaways': {
                await interaction.channel.send({ content: `\`[✅]\` ${interaction.member} votre giveaways est en cours de création ...` }).then(async (m) => {
                    const question_0 = interaction.fields.getTextInputValue('channelID');
                    const channel = interaction.guild.channels.cache.get(question_0);
                    
                    channel.send({
                        content: `@everyone`,
                        embeds: [{
                            color: Colors.Purple,
                            title: `Giveaways :`,
                            description: `> Création d'un giveaway en cours...`
                        }]
                    }).then(async (msg) => {
                        const question_1 = interaction.fields.getTextInputValue('price');

                        const question_2 = ms(interaction.fields.getTextInputValue('time'));
                        if(!Number(question_2) || isNaN(question_2)) {
                            m.edit({ content: `\`[❌]\` ${interaction.member} veuillez fournir un temps valide.` })
                            return;
                        }

                        const question_3 = interaction.fields.getTextInputValue('winner');
                        if(!Number(question_3) || isNaN(question_3)) {
                            m.edit({ content: `\`[❌]\` ${interaction.member} veuillez fournir un nombre de gagnant valide.` })
                            return;
                        }

                        await con.query(`INSERT INTO giveaways (created_by, created_at, finished_at, winner_count, channelID, messageID, price) VALUES ('${interaction.member.id}', '${Date.now()}', '${question_2}', '${Number(question_3)}', '${question_0}', '${msg.id}', '${question_1}')`, async function(err, result) {
                            await con.query(`SELECT * FROM giveaways WHERE messageID = '${msg.id}'`, function(err, result) {
                                let new_time = ms2(result[0].finished_at - (Date.now() - result[0].created_at))

                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`giveaway_enter_${result[0].id}`)
                                            .setEmoji("➕")
                                            .setLabel('Participer')
                                            .setStyle(ButtonStyle.Primary)
                                    )

                                msg.edit({
                                    embeds: [{
                                        color: Colors.Purple,
                                        title: `Giveaways :`,
                                        description: `> Crée par ${interaction.member} (**${interaction.user.tag}**).`,
                                        fields: [
                                            {
                                                name: `\`[🎁]\` Gain :`,
                                                value: `\`\`\`\n${question_1}\n\`\`\``
                                            },
                                            {
                                                name: `\`[👤]\` Gagnant :`,
                                                value: `\`\`\`\n${question_3}\n\`\`\``
                                            },
                                            {
                                                name: `\`[📌]\` Participant(s) :`,
                                                value: `0`
                                            }
                                        ],
                                        footer: {
                                            text: `Finis dans ${new_time.days} jour(s) : ${new_time.hours} heure(s) : ${new_time.minutes} minute(s) : ${new_time.seconds} seconde(s).`
                                        }
                                    }],
                                    components: [ row ]
                                }).then(async () => {
    
                                })
                            })
                        })

                        con.query(`INSERT INTO giveaways_entry (giveawayID, giveaway_entries) VALUES ('${msg.id}', '[]')`, function(err, result) {
                            console.log('Saved !')
                        })
                    })
                })
                break;
            }
        }
    }

    async function giveawaysButton() {
        if(!interaction.isButton()) return;

        await con.query(`SELECT * FROM giveaways WHERE messageID = '${interaction.message.id}'`, function(err, result) {
            if(!result[0]) return;

            const target = interaction.guild.members.cache.get(result[0].created_by);
            let timeRemaining = ms2(result[0].finished_at - (Date.now() - result[0].created_at));

            switch(interaction.customId) {
                case `giveaway_enter_${result[0].id}`: {
                    con.query(`SELECT * FROM giveaways_entry WHERE giveawayID = '${interaction.message.id}'`, function(err, result) {
                        if(!result[0]) return;

                        if(!result[0].giveaway_entries.includes(interaction.member.id)) {
                            let data = Math.floor(Number(interaction.message.embeds[0].data.fields[2].value) + 1);
        
                            interaction.message.edit({
                                embeds: [{
                                    color: Colors.Purple,
                                    title: `Giveaways :`,
                                    description: `> Crée par <@${target.user.id}> (**${target.user.username}#${target.user.discriminator}**).`,
                                    fields: [
                                        {
                                            name: `\`[🎁]\` Gain :`,
                                            value: `\`\`\`\n${result[0].price}\n\`\`\``
                                        },
                                        {
                                            name: `\`[👤]\` Gagnant :`,
                                            value: `\`\`\`\n${result[0].winner_count}\n\`\`\``
                                        },
                                        {
                                            name: `\`[📌]\` Participant(s) :`,
                                            value: `${data}`
                                        }
                                    ],
                                    footer: {
                                        text: `Finis dans ${timeRemaining.days} jour(s) : ${timeRemaining.hours} heure(s) : ${timeRemaining.minutes} minute(s) : ${timeRemaining.seconds} seconde(s).`
                                    }
                                }],
                            }).then(async () => {
                                interaction.reply({ content: `\`[✅]\` ${interaction.member} vous venez de participer à un giveaway.`, ephemeral: true });
                            })
                        } else {
                            interaction.reply({ content: `\`[❌]\` ${interaction.member} vous participez déjà à ce giveaway.`, ephemeral: true })
                        }
                    })
                    break;
                }
            }
        })
    }

    async function modmailButton() {
        const channel = client.channels.cache.get('1086761712566419647');

        if(!interaction.isButton()) return;

        switch(interaction.customId) {
            case 'ticket_close': {
                con.query(`SELECT * FROM modmails WHERE channelID = '${interaction.channel.id}'`, function(err, result) {
                    if(err) return;

                    const target = interaction.guild.members.cache.get(result[0].userID);

                    con.query(`DELETE FROM modmails WHERE channelID = '${result[0].channelID}'`, function(err, result) {
                        interaction.channel.send({ content: `\`[✅]\` ${interaction.member} fermeture du ticket dans **5 secondes**.` }).then(async () => {
                            channel.send({
                                embeds: [{
                                    color: Colors.Red,
                                    title: `Logs > Ticket`,
                                    fields: [
                                        {
                                            name: `${target.user.tag}`,
                                            value: `L'utilisateur ${interaction.member} vient de fermer le ticket de **${target.user.tag}**.`
                                        },
                                    ]
                                }]
                            })

                            setTimeout(async () => {
                                await interaction.channel.delete();
                            }, 5000)
                        })
                    })
                })
                break;
            }

            case 'ticket_manage': {
                con.query(`SELECT * FROM modmails WHERE channelID = '${interaction.channel.id}'`, function(err, result)  {
                    if(err) return;
                })
                break;
            }

            case 'ticket_save': {
                con.query(`SELECT * FROM modmails WHERE channelID = '${interaction.channel.id}'`, function(err, result)  {
                    if(err) return;
                })
                break;
            }
        }
    }

    }
}