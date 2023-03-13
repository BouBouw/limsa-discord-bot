const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const mysql = require('mysql');
const { readdirSync } = require('fs');
const colors = require('colors');

const config = require('./settings.json');

module.exports = (client) => {
    // # Database
    const con = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    })

    con.connect(function (err) {
        if(err) return console.log(`[*]`.bold.red + ` Connexion to database cancel.`.bold.white);

        console.log(`[*]`.bold.green + ` Database has been connected.`.bold.white)
    });

    console.log(`•----------•`.bold.black);

    // # Commands
    const arrayOfSlashCommands = [];

    const loadSlashCommands = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs => {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const files of commands) {
                const getFileName = require(`../${dir}/${dirs}/${files}`);
                client.commands.set(getFileName.name, getFileName);
                console.log(`[SLASH COMMANDS]`.bold.blue + ` Loading command :`.bold.white + ` ${getFileName.name}`.bold.blue);
                arrayOfSlashCommands.push(getFileName);
            }
        })

        setTimeout(async () => {
            await console.log(`•----------•`.bold.black);
            
            await console.log(`[API]`.bold.cyan + ` Synchronize all commands with Discord API.`.bold.white)
            await client.application.commands.set(arrayOfSlashCommands);

            return console.log(`•----------•`.bold.black);
        }, 5000)
    }
    loadSlashCommands();

    console.log(`•----------•`.bold.black);

    // # Events
    const loadEvents = (dir = "./events/") => {
        readdirSync(dir).forEach(dirs => {
            const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));
      
            for(const files of events) {
                const getFileName = require(`../${dir}/${dirs}/${files}`)
                client.on(getFileName.name, (...args) => getFileName.execute(...args, client, con))
                console.log(`[EVENTS]`.bold.blue + ` Loading event :`.bold.white + ` ${getFileName.name}`.bold.blue);
                if(!events) return console.log(`[EVENTS]`.bold.red + `Nothing event in : `.bold.yellow + `${files}`.bold.red)
            }
        })
    }
    loadEvents();
    console.log(`•----------•`.bold.black)

    // # Dashboard
    const loadDashboard = () => {
        require('../dashboard/index.js')(client, con);
    }
    loadDashboard();

    // # Initial Events
    const loadInitialEvents = async () => {
        const event = require('../events/client/ready.js');
        await event.execute(client, con);
    
        const event_1 = require('../events/guilds/ready.js');
        await event_1.execute(client, con);
    }
    loadInitialEvents();
}