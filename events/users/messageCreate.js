const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
	name: 'messageCreate',
	once: false,
execute: async (message, client, con) => {
    await modmailsSystem();
    await messageAttachment();

    async function modmailsSystem() {
        if(message.author.bot) return;

        const guild = client.guilds.cache.get('1082062342499618966');
        const channelParent = guild.channels.cache.get('1082450914545254471');

        try {
            if(message.channel.type === ChannelType.DM) {
                con.query(`SELECT * FROM modmails WHERE userID = '${message.author.id}'`, function(err, result) {
                    if(!result[0]) {
                        guild.channels.create({
                            name: `${message.author.username}`,
                            parent: channelParent.parent.id,
                            type: ChannelType.GuildText,
                            permissionOverwrites: [
                                {
                                    id: guild.id,
                                    deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ]
                                },
                                {
                                    id: message.author.id,
                                    deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ]
                                }
                            ],
                        }).then(async (channel) => {
                            con.query(`INSERT INTO modmails (userID, channelID) VALUES ('${message.author.id}', '${channel.id}')`, function(err, result) {
                                try {
                                    message.author.send({ content: `\`[✅]\` ${message.author} votre ticket vient d'être crée.` })
                                    
                                    const c = guild.channels.cache.get('1086761712566419647');
                                    if(!c) return;

                                    c.send({
                                        embeds: [{
                                            color: Colors.Green,
                                            title: `Logs > Ticket`,
                                            fields: [
                                                {
                                                    name: `${message.author.username}#${message.author.discriminator}`,
                                                    value: `Cet utilisateur vient de crée un ticket.`,
                                                },
                                                {
                                                    name: `Identifiant`,
                                                    value: `${message.author.id}`
                                                }
                                            ]
                                        }]
                                    })
                                } catch(err) {
                                    return;
                                }
                            })

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('ticket_close')
                                        .setEmoji('⛔')
                                        .setLabel("Fermer le ticket")
                                        .setStyle(ButtonStyle.Danger),
                                    new ButtonBuilder()
                                        .setCustomId('ticket_manage')
                                        .setEmoji('👥')
                                        .setLabel("Gérer le ticket")
                                        .setStyle(ButtonStyle.Secondary),
                                    new ButtonBuilder()
                                        .setCustomId('ticket_save')
                                        .setEmoji('📑')
                                        .setLabel("Sauvegarder le ticket")
                                        .setStyle(ButtonStyle.Secondary),
                                )

                            channel.send({
                                content: `@everyone, `,
                                embeds: [{
                                    color: Colors.Purple,
                                    title: `Ticket de ${message.author.username}#${message.author.discriminator}`,
                                    fields: [
                                        {
                                            name: "`[⛔]` Fermer",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[👥]` Gérer",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                        {
                                            name: "`[📑]` Sauvegarder",
                                            value: `\u200b`,
                                            inline: true
                                        },
                                    ]
                                }],
                                components: [ row ]
                            })
                        })
                    } else {
                        return message.channel.send({ content: `\`[❌]\` ${message.author} vous avez déjà un ticket ouvert.` })
                    }
                })
            }
        } catch(err) {
            console.log(err);
        }
    }

    async function messageAttachment() {
        if(message.author.bot) return;
        if(message.channel.id === '1082450923114205234') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('selfie')
                        .setEmoji('❤️')
                        .setLabel("Aimer")
                        .setStyle(ButtonStyle.Secondary)
                )
            
            try {
                if(message.attachments.size > 0) {
                    const attachment = message.attachments;

                    return message.channel.send({
                        embeds: [{
                            color: Colors.Purple,
                            title: `Selfie de ${message.user.tag}`,
                            image: {
                                url: `${attachment ? attachment.url : null}`,
                            },
                            footer: {
                                text: `Les réactions boostent les posibilitées de découverte du profil.`
                            }
                        }],
                        components: [ row ]
                    }).then(async () => {
                        message.delete();
                    })
                } else {
                    message.delete().then(async () => {
                        message.channel.send({ content: `\`[❌]\` ${message.author} vous ne pouvez envoyer que des images ou vidéos.`, ephemeral: true })
                    })
                }
            } catch(err) {
                return;
            }
        }
    }

    }
}