const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, NoSubscriberBehavior, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
	name: 'ready',
	once: false,
execute: async (client) => {
    await Music();

    async function Music() {
        const channel = client.channels.cache.get('1082450824875229225');

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 3000);
        await connection;
    };


    }
}