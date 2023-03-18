const { ChannelType, PermissionsBitField, Colors } = require("discord.js");

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
execute: async (oldState, newState, client, con) => {
    await customVoices();
    await Logs();

    async function customVoices() {
        con.query(`SELECT * FROM custom_voices`, function(err, result) {
            if(!newState.channel) {
                try  {
                    con.query(`SELECT * FROM custom_voices WHERE channelID = '${oldState.channel.id}'`, function(err, result) {
                        if(!result[0]) return;

                        if(oldState.channel.members.size === 0) {
                            con.query(`DELETE FROM custom_voices WHERE channelID = '${oldState.channel.id}'`, function(err, result) {
                                oldState.channel.delete();
                            });
                        }
                    })
                } catch(err) {
                    return;
                }
            } else {
                if(newState.channel.id === '1086130101588074576') {
                    const channelParent = newState.guild.channels.cache.get('1086130101588074576');

                    newState.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `${newState.member.user.username}`,
                        parent: channelParent.parent.id,
                        permissionOverwrites: [
                            {
                                id: newState.member.user.id,
                                allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Stream, PermissionsBitField.Flags.PrioritySpeaker ]
                            }
                        ],
                        userLimit: 1
                    }).then(async (channel) => {
                        newState.setChannel(channel);

                        setInterval(async () => {
                            if(channel.members === 0) {
                                await channel.delete();
                            }
                        }, 5000)

                        con.query(`INSERT INTO custom_voices (channelID) VALUES ('${channel.id}')`, function(err, result) {
                            // logs
                        })
                    })
                } else {
                    try  {
                        con.query(`SELECT * FROM custom_voices WHERE channelID = '${channel.id}'`, function(err, result) {
                            if(!result[0]) return;

                            if(channel.members.size  === 0) {
                                con.query(`DELETE FROM custom_voices WHERE channelID = '${channel.id}'`);
                                channel.delete();
                            }
                        })
                    } catch(err) {
                        return;
                    }
                }
            }
        })
    }

    async function Logs() {
        const channel = client.channels.cache.get('1086758716084342865');
        if(!channel) return;

        if(!oldState.channel && newState.channel) {
            channel.send({
                embeds: [{
                    color: Colors.Green,
                    title: `Logs > Vocal`,
                    fields: [
                        {
                            name: `${newState.member.user.tag}`,
                            value: `Cet utilisateur vient de ce connecter au salon ${newState.channel}.`
                        },
                        {
                            name: `Identifiant`,
                            value: `${newState.member.user.id}`
                        }
                    ]
                }]
            })
        }

        if(oldState.channel && newState.channel) {
            if(oldState.channel.id !== newState.channel.id) {
                channel.send({
                    embeds: [{
                        color: Colors.Orange,
                        title: `Logs > Vocal`,
                        fields: [
                            {
                                name: `${newState.member.user.tag}`,
                                value: `Cet utilisateur vient de ce déplacer du salon ${oldState.channel} à ${newState.channel}.`
                            },
                            {
                                name: `Identifiant`,
                                value: `${newState.member.user.id}`
                            }
                        ]
                    }]
                })
            }
        }

        if(oldState.channel && !newState.channel) {
            channel.send({
                embeds: [{
                    color: Colors.Red,
                    title: `Logs > Vocal`,
                    fields: [
                        {
                            name: `${oldState.member.user.tag}`,
                            value: `Cet utilisateur vient de ce déconnecter du salon ${oldState.channel}.`
                        },
                        {
                            name: `Identifiant`,
                            value: `${oldState.member.user.id}`
                        }
                    ]
                }]
            })
        }

        if(oldState.channel === newState.channel) {
            if(newState.streaming === true && oldState.streaming === false) {
                channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Logs > Vocal`,
                        fields: [
                            {
                                name: `${newState.member.user.tag}`,
                                value: `Cet utilisateur vient de démarrer un streaming dans ${newState.channel}.`
                            },
                            {
                                name: `Identifiant`,
                                value: `${newState.member.user.id}`
                            }
                        ]
                    }],
                    components: [ row ]
                })
            } else if(newState.streaming === true && oldState.streaming === false) {
                channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Logs > Vocal`,
                        fields: [
                            {
                                name: `${newState.member.user.tag}`,
                                value: `Cet utilisateur vient d'arreter un streaming dans ${newState.channel}.`
                            },
                            {
                                name: `Identifiant`,
                                value: `${newState.member.user.id}`
                            }
                        ]
                    }],
                    components: [ row ]
                })
            }

            if(newState.selfVideo === true && oldState.selfVideo === false) {
                channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Logs > Vocal`,
                        fields: [
                            {
                                name: `${newState.member.user.tag}`,
                                value: `Cet utilisateur vient d'activer sa caméra dans ${newState.channel}.`
                            },
                            {
                                name: `Identifiant`,
                                value: `${newState.member.user.id}`
                            }
                        ]
                    }],
                    components: [ row ]
                })
            } else if(newState.selfVideo === true && oldState.selfVideo === false) {
                channel.send({
                    embeds: [{
                        color: Colors.Blue,
                        title: `Logs > Vocal`,
                        fields: [
                            {
                                name: `${newState.member.user.tag}`,
                                value: `Cet utilisateur vient de désactiver sa caméra dans ${newState.channel}.`
                            },
                            {
                                name: `Identifiant`,
                                value: `${newState.member.user.id}`
                            }
                        ]
                    }],
                    components: [ row ]
                })
            }
        }
    }
    }
}