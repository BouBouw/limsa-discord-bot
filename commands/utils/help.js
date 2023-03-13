const { ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, Colors } = require('discord.js');

module.exports = {
    name: 'help',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_menu')
                .setPlaceholder("Choisissez une catégorie")
                .addOptions(
                    {
                        label: "Paramètres",
                        emoji: "⚙️",
                        value: "settings"
                    },
                    {
                        label: "Créateurs",
                        emoji: "👑",
                        value: "owners"
                    },
                    {
                        label: "Administrateurs",
                        emoji: "📌",
                        value: "admin"
                    },
                    {
                        label: "Modérateurs",
                        emoji: "🔧",
                        value: "mods"
                    },
                    {
                        label: "Musique",
                        emoji: "🎶",
                        value: "music"
                    },
                    {
                        label: "Giveaways",
                        emoji: "🎁",
                        value: "giveaways"
                    },
                    {
                        label: "Divers",
                        emoji: "💡",
                        value: "various"
                    },
                    {
                        label: "Jeux",
                        emoji: "🎮",
                        value: "games"
                    },
                )
        )
        interaction.followUp({
            embeds: [{
                color: Colors.Purple,
                title: "Page d'aide",
                description: `Développer par <@853261887520505866>`,
                fields: [
                    {
                        name: "`[❓]` Commandes :",
                        value: `> **__Les commandes s'afficheront ici.__**`
                    }
                ],
                footer: {
                    text: "0/8"
                }
            }],
            components: [ row ]
        }).then(async (msg) => {
            await Menus();

            async function Menus() {
                const filter = (interaction) => interaction.user.id === interaction.member.id && interaction.isStringSelectMenu();
                let collected;
                try {
                    collected = await msg.awaitMessageComponent({ filter: filter, time: 0 });
                } catch(err) {
                    if(err.code === 'INTERACTION_COLLECTOR_ERROR') {
                        return msg.delete();
                    }
                }

                if(!collected.deffered) await collected.deferUpdate();

                switch(collected.values[0]) {
                    case 'settings': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[⚙️]` Commandes :",
                                        value: "> `settings`"
                                    }
                                ],
                                footer: {
                                    text: "1/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'owners': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[👑]` Commandes :",
                                        value: "> `ownerlist`, `whitelist`, `blacklist`"
                                    }
                                ],
                                footer: {
                                    text: "2/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'admin': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[📌]` Commandes :",
                                        value: "> `x`"
                                    }
                                ],
                                footer: {
                                    text: "3/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'mods': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[🔧]` Commandes :",
                                        value: "> `ban`, `unban`, `kick`, `clear`, `mute`, `unmute`, `mutelist`"
                                    }
                                ],
                                footer: {
                                    text: "4/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'music': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[🎶]` Commandes :",
                                        value: "> `playlist`"
                                    }
                                ],
                                footer: {
                                    text: "5/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'giveaways': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[🎁]` Commandes :",
                                        value: "> `giveaways`"
                                    }
                                ],
                                footer: {
                                    text: "6/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'various': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[💡]` Commandes :",
                                        value: "> `help`, `ping`"
                                    }
                                ],
                                footer: {
                                    text: "7/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }

                    case 'games': {
                        msg.edit({
                            embeds: [{
                                color: Colors.Purple,
                                title: "Page d'aide",
                                description: `Développer par <@853261887520505866>`,
                                fields: [
                                    {
                                        name: "`[🎮]` Commandes :",
                                        value: "> `x`"
                                    }
                                ],
                                footer: {
                                    text: "8/8"
                                }
                            }],
                        })

                        await Menus();
                        break;
                    }
                }
            }
        })
    }
}