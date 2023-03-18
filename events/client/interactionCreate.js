module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client, con) => {
    await slashCommands();

    async function slashCommands() {
        const bypass = ['giveaways']
        if(interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if(!cmd.name.includes(bypass)) {
                await interaction.deferReply({ ephemeral: false }).catch(() => {});

                if(!cmd) {
                    return interaction.followUp({ content: `\`[⚠️]\` ${interaction.member} une erreur est survenue.` })
                }
    
                const args = [];
    
                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        
                console.log(`[CMD] `.bold.blue + `/${cmd.name}`.bold.underline.cyan + ` has been executed`.bold.white)
                cmd.execute(client, interaction, args, con);
            } else {
                if(!cmd) {
                    return interaction.followUp({ content: `\`[⚠️]\` ${interaction.member} une erreur est survenue.` })
                }
    
                const args = [];
    
                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        
                console.log(`[CMD] `.bold.blue + `/${cmd.name}`.bold.underline.cyan + ` has been executed`.bold.white)
                cmd.execute(client, interaction, args, con);
            }
            
            }
        }
    }
}