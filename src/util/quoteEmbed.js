const { EmbedBuilder } = require("@discordjs/builders");
const quotes = require('../json/quotes.json').quotes
const pfps = require('../json/pfps.json').pfps
const j_rarity = require('../json/rarities.json').rarities
const upgrades = require('../json/upgrades.json')[0]
const Database = require('better-sqlite3');

const { log } = require("./logger");

function createQuoteEmbed(id, cooldown, interaction, daily=true){

    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]
    
    quote_embed = new EmbedBuilder()
            
            
            .setColor(rarity.color)
            .setImage(chosen_quote.quote)
            .setThumbnail(pfps[chosen_quote.origin])
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setURL(chosen_quote.msg_link)
            .addFields([{
                name: rarity.name + ` (${rarity.chance}% Chance)`,
                value: Math.round(rarity.bucks).toString() + ' Quotebucks',
                inline: false
            },
            {
                name: 'Quote by '+ chosen_quote.origin,
                value: chosen_quote.reason,
                inline: false    
            }]);
            if(daily){
                quote_embed.setTitle('You got ' + chosen_quote.name)
                .setDescription(`The next time you can quote is <t:${cooldown}:R>`)
            }else{
                quote_embed.setTitle(chosen_quote.name)
            }
    return quote_embed
}

function createQuoteEmbed_Collection(id, user){

    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]
    
    quote_embed = new EmbedBuilder()
            .setColor(rarity.color)
            .setImage(chosen_quote.quote)
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setThumbnail(pfps[chosen_quote.origin])
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: user.displayAvatarURL(),
                name: user.tag
            })
            .setURL(chosen_quote.msg_link)
            .addFields([{
                name: rarity.name + ` (${rarity.chance}% Chance)`,
                value: Math.round(rarity.bucks).toString() + ' Quotebucks',
                inline: false
            },
            {
                name: 'Quote by '+ chosen_quote.origin,
                value: chosen_quote.reason,
                inline: false    
            }]);
           
            quote_embed.setTitle(chosen_quote.name)
            
    return quote_embed
}

function createUpgradeEmbed(id){
    upgrade_embed = new EmbedBuilder()
            .setTitle("You got "+upgrades[id].name+" Upgrade!")
            .setDescription(upgrades[id].description)
            .setColor([0,0,0])
            .setThumbnail(upgrades[id].sprite)
    return upgrade_embed
}


module.exports = {createQuoteEmbed, createUpgradeEmbed, createQuoteEmbed_Collection}
