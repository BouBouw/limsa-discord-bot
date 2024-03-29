const { ActivityType } = require("discord.js");
const colors = require('colors');

module.exports = {
	name: 'ready',
	once: false,
execute: async (client, con) => {
    console.log(`[*]`.bold.green + ` Connected has Discord.`.bold.white);

    con.query(`SELECT * FROM settings`, function(err, result) {
        if(!result) {
            return;
        } else {
            let ActivitiesType;
            switch(result[0].activities_type) {
                case 'watching': {
                    ActivitiesType = ActivityType.Watching;
                    break;
                }

                case 'streaming': {
                    ActivitiesType = ActivityType.Streaming;
                    break;
                }
            }

            client.user.setPresence({
                activities: [
                    {
                        name: `${result[0].activities_text}`,
                        type: ActivitiesType,
                        url: 'https://twitch.tv/bouubouuw'
                    }
                ],
                status: `${result[0].activities_status}`
            })
        }
    })

    }
}