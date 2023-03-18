const { Colors, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, NoSubscriberBehavior, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const ms2 = require('parse-ms');

const youtube = new YouTubeAPI('AIzaSyAJccFnJD7r19SnFbkDhfhWKcpIQ3TuGAo');

module.exports = {
	name: 'ready',
	once: false,
execute: async (client, con) => {
    // await Music();
    await Giveaways();
    await Counters();

    async function Music() {
        const guild = client.guilds.cache.get('1082062342499618966');
        setInterval(() => {
            if(!guild.channels.cache.some(channel => channel.type === ChannelType.GuildVoice && channel.members.has(client.user.id))) {
                const channel = client.channels.cache.get('1082450824875229225');
                setInterval(async () => {
                    let url = 'https://www.youtube.com/watch?v=Vl-GJaitlNs&list=PLSAXXgFd5LA7G9-gGmbfiVzQi4ClJp98L';
    
                    const serverQueue = client.queue.get(guild.id);
    
                    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    
                    const urlValid = playlistPattern.test(url);
    
                    const queueConstruct = {
                        channel,
                        connection: null,
                        songs: [],
                        loop: false,
                        volume: 50,
                        muted: false,
                        playing: true
                    };
    
                    let songInfo = null;
                    let song = null;
    
                    if(urlValid) {
                        try {
                            songInfo = await ytdl.getInfo(url);
                            song = {
                                title: songInfo.videoDetails.title,
                                url: songInfo.videoDetails.video_url,
                                duration: songInfo.videoDetails.lengthSeconds,
                            };
                        } catch(err) {
                            console.log('err: music')
                        }
                    } else {
                        try {
                            const results = await youtube.searchVideos(url, 1, { part: "id" });
    
                            if(!results.length) console.log('err : music 2')
    
                            songInfo = await ytdl.getInfo(results[0].url);
                            song = {
                                title: songInfo.videoDetails.title,
                                url: songInfo.videoDetails.video_url,
                                duration: songInfo.videoDetails.lengthSeconds,
                            };
                        } catch(err) {
                            console.log('err : msuic 3')
                        }
                    }
    
                    if(serverQueue) {
                        serverQueue.songs.push(song);
                    } else {
                        queueConstruct.songs.push(song);
                        client.queue.set(guild.id, queueConstruct);
                    }
    
                    try {
                        const connection = joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        });
    
                        const player = createAudioPlayer({
                            behaviors: {
                                noSubscriber: NoSubscriberBehavior.Play,
                                maxMissedFrames: Math.round(5000 / 20),
                            }
                        });
                
                        const streamOptions = { seek: 0, volume: 1, filter : 'audioonly' };
                        const stream = ytdl(queueConstruct.songs[0].url, streamOptions);
                        console.log((queueConstruct.songs[0].duration / 17 * 100).toFixed(2));
                        
                        // console.log(songInfo.videoDetails)

                        const resource = createAudioResource(stream, {
                            inputType: StreamType.WebmOpus,
                        });
                
                        player.play(resource);
    
                        queueConstruct.connection = await entersState(connection, VoiceConnectionStatus.Ready, 5000);
                        await connection;
                        connection.subscribe(player)
                    } catch(err) {
                    }
                }, 5000)
            }
        }, 2500)
    };

    async function Giveaways() {
        setInterval(async () => {
            con.query(`SELECT * FROM giveaways`, function(err, result) {
                if(!result[0]) {
                    return;
                } else {
                    result.forEach(async (g) => {
                        if(g.finished_at < 0) {
                            await con.query(`DELETE FROM giveaways_entry WHERE giveawayID = '${g.messageID}'`, function(err, result) {
                                            
                            })

                            con.query(`DELETE FROM giveaways WHERE finished_at = '0'`, function(err, result) {
                                console.log('Ending giveaway !')
                            })
                        } else {
                            let interval = setInterval(timer, 5000);
                            async function timer() {
                                let timeRemaining = ms2(g.finished_at - (Date.now() - g.created_at));
        
                                const channel = client.channels.cache.get(g.channelID);
                                const message = channel.messages.fetch(g.messageID);
                                
                                Promise.resolve(message).then(async (msg) => {
                                    con.query(`SELECT * FROM giveaways WHERE messageID = '${msg.id}'`, function(err, result) {
                                        if(!result && !result[0]) console.log(`[!]`.bold.red + ` Waiting to synch again giveaways...`.bold.white);

                                        let entry = Number(msg.embeds[0].data.fields[2].value);
                                        const target = channel.guild.members.cache.get(result[0].created_by);
        
                                        msg.edit({
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
                                                            value: `${entry}`
                                                        }
                                                    ],
                                                    footer: {
                                                        text: `Finis dans ${timeRemaining.days} jour(s) : ${timeRemaining.hours} heure(s) : ${timeRemaining.minutes} minute(s) : ${timeRemaining.seconds} seconde(s).`
                                                    }
                                            }]
                                        })
                                    })
                                })
        
                                if(timeRemaining.days < 0 && timeRemaining.hours < 0 && timeRemaining.minutes < 0 && timeRemaining.seconds < 0) {
                                    Promise.resolve(message).then(async (msg) => {
                                        await clearInterval(interval);
        
                                        let entry = Number(msg.embeds[0].data.fields[2].value);

                                        channel.send({
                                            content: `> Le giveaway est désormais terminé ! Le gagnant est [x].`
                                        }).then(async () => {
                                            msg.edit({
                                                embeds: [{
                                                    color: Colors.Purple,
                                                        title: `Giveaways :`,
                                                        fields: [
                                                            {
                                                                name: `\`[👤]\` Gagnant :`,
                                                                value: `\`\`\`\n[x]\n\`\`\``
                                                            },
                                                            {
                                                                name: `\`[📌]\` Participant(s) :`,
                                                                value: `${entry}`
                                                            }
                                                        ],
                                                        footer: {
                                                            text: `Terminé.`
                                                        }
                                                }]
                                            })
                                        })
            
                                        await con.query(`DELETE FROM giveaways WHERE messageID = '${msg.id}'`, function(err, result) {
                                            
                                        })

                                        await con.query(`DELETE FROM giveaways_entry WHERE giveawayID = '${msg.id}'`, function(err, result) {
                                            
                                        })
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }, 30000)
    };

    async function Counters() {
        const guild = client.guilds.cache.get('1082062342499618966');
    };


    }
}