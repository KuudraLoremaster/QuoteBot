const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs')
const a = (Date.now() + (24*60*60*1000))

asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)

usersj = require("./users.json")
users = usersj.users

const quotes = require('./quotes.json').quotes
const rarities = require("./rarities.json").rarities
const q_rarities = require('./quotes_rarities.json').rarities

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote-daily')
        .setDescription('get your daily quote'),
        async execute(interaction, client){
           
            
            
            rarity_roll = rollRarity()
            rarity = rarities[rarity_roll]

            num = Math.floor(Math.random() * (q_rarities[rarity_roll].length))
            chosen_quote = quotes[0][num]
            
            quote_embed = new EmbedBuilder()
            .setTitle('You got ' + chosen_quote.name)
            .setDescription(`The next time you can quote is <t:${cooldown}:R>`)
            .setColor(rarity.color)
            .setImage(chosen_quote.quote)
            .setThumbnail(chosen_quote.pfp)
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setURL(chosen_quote.msg_link)
            .addFields([{
                name: rarity.name,
                value: rarity.bucks.toString() + ' quotebucks',
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

const rarity_mult = [ // rarity_id : weight
    {0: 0.649}, // Common
    {1: 0.25}, // Uncommon
    {2: 0.05}, // Rare
    {3: 0.035}, // Epic
    {4: 0.01}, // Legendary
    {5: 0.005}, // Unique
    {6: 0.00001} //The Quote
]

function rollRarity(){
    
    let rand = Math.random()
    for (let i = 0; i < rarity_mult.length; i++) {
        const rarity = rarity_mult[i][i]
        if(rand <= rarity){
            return i;
        }
        rand -= rarity
        
    }

    return 0;
}