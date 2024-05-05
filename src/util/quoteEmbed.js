const { EmbedBuilder } = require("@discordjs/builders");
const quotes = require('../json/quotes.json').quotes
const pfps = require('../json/pfps.json').pfps
const j_rarity = require('../json/rarities.json').rarities

function createQuoteEmbed(id, cooldown, interaction){

    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]

    quote_embed = new EmbedBuilder()
            .setTitle('You got ' + chosen_quote.name)
            .setDescription(`The next time you can quote is <t:${cooldown}:R>`)
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
                name: rarity.name,
                value: rarity.bucks.toString() + ' quotebucks',
                inline: false
            },
            {
                name: 'Quote by '+ chosen_quote.origin,
                value: chosen_quote.reason,
                inline: false    
            }]);
    return quote_embed
}

module.exports = {createQuoteEmbed}