const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs')
const a = (Date.now() + (24*60*60*1000))

asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)

usersj = require("./users.json")
quotesj = require('./quotes.json')
raritiesj = require("./rarities.json")

users = users.users
quotes = quotesj.quotes
rarities = raritiesj.rarities

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote-daily')
        .setDescription('get your daily quote'),
        async execute(interaction, client){
            chosen_quote = quotes[Math.floor(Math.random) * quotes.length]
            quote_embed = new EmbedBuilder()
            .setTitle('You got ' + chosen_quote.name)
            .setDescription('The next time you can quote is in <t:${cooldown}:R>')
            .setColor(0x18e1ee)
            .setImage(chosen_quote.quote)
            .setThumbnail(chosen_quote.pfp)
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setURL(chosen_quote.msg_link)
            .addFields([{
                name: rarities[chosen_quote.rarity],
                value: chosen_quote.bucks + ' quotebucks',
                inline: false
            },
            {
                name: 'Quote by '+ chosen_quote.origin,
                value: chosen_quote.reason,
                inline: false    
            }]);

            await interaction.reply({
                embeds: [quote_embed]
            })
        }
}