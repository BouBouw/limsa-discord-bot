const { ApplicationCommandType, ApplicationCommandOptionType, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    name: 'profile',
    description: '(💕) Meet',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'member',
            description: "Profile d'un membre.",
            type: ApplicationCommandOptionType.User,
            required: false
        },
    ],
execute: async (client, interaction, args, con) => {
    const target = interaction.options.getMember('member');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('edit')
                .setLabel("Editer votre profil")
                .setStyle(ButtonStyle.Secondary),
        )

    interaction.followUp({
        embeds: [{
            color: Colors.Purple,
            title: `Profil de ${target ? `${target.user.tag}` : `${interaction.user.tag}`}`,
            fields: [
                {
                    name: `Apperçu de votre profil :`,
                    value: `**__Biographie :__**\n> Description Here !`,
                    inline: false
                },
                {
                    name: `A propos :`,
                    value: `\u200b`,
                    inline: false
                },
                {
                    name: `Genre :`,
                    value: `[x]`,
                    inline: true
                },
                {
                    name: `Age :`,
                    value: `[x]`,
                    inline: true
                },
                {
                    name: `Recherche :`,
                    value: `[x]`,
                    inline: true
                },
                {
                    name: `Situation :`,
                    value: `[x]`,
                    inline: true
                },
                {
                    name: `Localisation :`,
                    value: `[x]`,
                    inline: true
                },
                {
                    name: `\`[💎]\` Abonnement :`,
                    value: `Aucun`,
                    inline: true
                },
                {
                    name: `Rencontre(s) :`,
                    value: `\u200b`,
                    inline: false
                },
                {
                    name: "`[💓]` A aimer :",
                    value: `> **x** personnes`,
                    inline: true
                },
                {
                    name: "`[❤️]` Aimer par :",
                    value: `> **x** personnes`,
                    inline: true
                },
                {
                    name: "`[💞]` Match avec :",
                    value: `> **x** personnes`,
                    inline: true
                },
                {
                    name: `Photo(s) :`,
                    value: `\u200b`,
                    inline: false
                }
            ],
            image: {
                url: "https://th.bing.com/th/id/R.33c0f6d489d2fb8478ecdab0fa71ad3d?rik=XDtwSzB84BEFKQ&riu=http%3a%2f%2firdjigs.com%2fuploads%2firdjigs%2fgrid.png&ehk=sY3lLDcwQ24Yw0NKWYbxJW1q3RO5O0OI9wGpiRgYCX8%3d&risl=&pid=ImgRaw&r=0"
            },
            footer: {
                text: `Compte actif depuis : [x] | Dernière activité : [x]`
            }
        }],
        components: [ row ]
    })
    }
}