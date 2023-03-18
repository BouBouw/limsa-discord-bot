const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField, Colors, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const ms2 = require('parse-ms');

module.exports = {
    name: 'giveaways',
    description: '(🎁) Giveaways',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'input',
            description: "Le type d'interaction avec la commande.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: `Liste`,
                    value: `list`
                },
                {
                    name: `Crée`,
                    value: `create`
                },
                {
                    name: `Annuler`,
                    value: `cancel`
                }
            ]
        },
        {
            name: `channel`,
            description: `Salon du giveaway.`,
            type: ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],
execute: async (client, interaction, args, con) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return interaction.followUp({ content: `\`[⛔]\` ${interaction.member} vous n'avez pas la permission d'utiliser cette commande.` });
    
    const type = interaction.options.getString('input');
    const channel = interaction.options.getChannel('channel');

    switch(type) {
        case 'list': {
            interaction.reply({ content: `${interaction.member}` })
            interaction.channel.send({
                embeds: [{
                    color: Colors.Purple,
                    title: "Liste des giveaways :",
                    description: `> **__Chargement des données...__**`,
                    footer: {
                        text: "0/0"
                    }
                }]
            }).then(async (msg) => {
                con.query(`SELECT * FROM giveaways`, function(err, result) {
                    if(!result[0]) {
                        return msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Liste des giveaways :",
                                description: `> **__Aucun giveaway en cours__**`,
                                footer: {
                                    text: "0/0"
                                }
                            }]
                        })
                    } else {
                        let list = [];
                        result.forEach(async (e) => {
                            const target = interaction.guild.members.cache.get(e.created_by);
                            let timeRemaining = ms2(e.finished_at - (Date.now() - e.created_at));

                            list.push(`\`${e.id}\` | Crée par **${target.user.tag}** - <#${e.channelID}>.\n> Term. dans **${timeRemaining.days}:${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}**.`);
                        })

                        return msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Liste des giveaways :",
                                description: `${list.join('\n\n')}`,
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

        case 'create': {
            if(!channel) return interaction.reply({ content: `\`[❌]\` ${interaction.member} veuillez utiliser l'argument \`channel\`.` });

            // modals
            const modal = new ModalBuilder()
                .setCustomId('giveaways')
                .setTitle("Création d'un giveaway")

            const question_0 = new TextInputBuilder()
                .setCustomId('channelID')
                .setLabel(`Identifiant du salon :`)
                .setPlaceholder(`${channel.id}`)
                .setValue(`${channel.id}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const question_1 = new TextInputBuilder()
                .setCustomId('price')
                .setLabel(`Gain :`)
                .setPlaceholder(`Entrez le gain du giveaway.`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const question_2 = new TextInputBuilder()
                .setCustomId('time')
                .setLabel('Temps :')
                .setPlaceholder(`Entrez une durée (ex: 1d, 1w, ...).`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const question_3 = new TextInputBuilder()
                .setCustomId('winner')
                .setLabel(`Nombre de gagnant(s) :`)
                .setPlaceholder(`Entrez le nombre de gagnant.`)
                .setValue('1')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const firstQuestionRow = new ActionRowBuilder().addComponents(question_0);
            const secondQuestionRow = new ActionRowBuilder().addComponents(question_1);
            const thirdQuestionRow = new ActionRowBuilder().addComponents(question_2);
            const fourQuestionRow = new ActionRowBuilder().addComponents(question_3);

            modal.addComponents(firstQuestionRow, secondQuestionRow, thirdQuestionRow, fourQuestionRow);

            await interaction.showModal(modal);
            break;
        }

        case 'cancel': {
            con.query(`SELECT * FROM giveaways WHERE channelID = '${channel.id}'`, function(err, result) {
                if(!result[0]) return interaction.reply({ content: `\`[❌]\` ${interaction.member} aucun giveaway trouver dans ${channel}.` });

                interaction.reply({ content: `${interaction.member}` })
                interaction.channel.send({
                    embeds: [{
                        color: Colors.Purple,
                        title: "Liste des giveaways :",
                        description: `> **__Chargement des données...__**`,
                        footer: {
                            text: "0/0"
                        }
                    }]
                }).then(async (msg) => {
                    let list = [];

                    result.forEach(async (e) => {
                        const target = interaction.guild.members.cache.get(e.created_by);
                        let timeRemaining = ms2(e.finished_at - (Date.now() - e.created_at));
    
                        list.push(`\`${e.id}\` | Crée par **${target.user.tag}** - <#${e.channelID}>.\n> Term. dans **${timeRemaining.days}:${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}**.`);
                    })

                    // add Buttons

                    return msg.edit({
                        embeds: [{
                            color: Colors.Purple,
                            title: "Liste des giveaways :",
                            description: `${list.join('\n')}`,
                            footer: {
                                text: "0/0"
                            }
                        }]
                    })
                })
            })
            break;
        }
    }
    }
}