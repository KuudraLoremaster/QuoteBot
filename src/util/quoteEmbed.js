const { EmbedBuilder } = require("@discordjs/builders");
const quotes = require('../json/quotes.json').quotes
const pfps = require('../json/pfps.json').pfps
const j_rarity = require('../json/rarities.json').rarities
const upgrades = require('../json/upgrades.json')[0]

function createQuoteEmbed(id, cooldown, interaction){

    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]
    sql = `SELECT * FROM users WHERE tag='${interaction.user.tag}'`
            const userArray = db.prepare(sql).all();
            console.log(userArray)
            if (userArray.length == 0) {
                console.log('user isnt registerd')
                data = { userID: interaction.user.id, quotes : `${chosen_quote.name}: 1`, quotebucks: rarity.bucks, tag: interaction.user.tag}
                sql=`INSERT INTO users (userID,quotes,quotebucks,tag) VALUES (?,?,?,?)`
                quoteString = `${chosen_quote.name}: 1`
                let insertData = db.prepare(sql)
                insertData.run(data.userID, data.quotes, data.quotebucks, data.tag)
                console.log(userArray)
            }
            else {
                let userQuotesArr = db.prepare(`SELECT quotes FROM users WHERE tag='${interaction.user.tag}'`).all()
                console.log(userQuotesArr)
                for (userQuotes of userQuotesArr) {
                    for ([key,value] of Object.entries(userQuotes)) {
                        console.log(value)
                        if (value.includes(chosen_quote.name)) {
                            console.log(`user has this quote`)
                            val2 = value.split(',')
                            for (userQuote of val2) {
                                console.log(userQuote)
                                if (userQuote.includes(chosen_quote.name)) {
                                    userQuote = userQuote.split(':')
                                    userQuote[1] = parseInt(userQuote[1]) + 1
                                    console.log(userQuote)
                                    index = val2.findIndex(element => element.startsWith(`${chosen_quote.name}`));
                                    console.log(index)
                                    userQuote = userQuote.join(':')
                                    userQuote = userQuote.toString()
                                    console.log(userQuote)
                                    val2[index] = userQuote
                                    console.log(val2)
                                    sql = `UPDATE users SET quotes ='${val2}' WHERE tag= '${interaction.user.tag}'`
                                    updateData = db.prepare(sql)
                                    updates = updateData.run()
                                    userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${interaction.user.tag}'`).all()
                                    for (userBucksObj of userBucksArr) {
                                        for([key,value] of Object.entries(userBucksObj)) {
                                            userBucks = value
                                        }
                                        userBucks = parseInt(userBucks) + rarity.bucks
                                    }                      
                                    sql = `UPDATE users SET quotebucks='${userBucks}' WHERE tag='${interaction.user.tag}'`
                                    updateData = db.prepare(sql)
                                    updateData.run()
                                    users = db.prepare(`SELECT * FROM users`).all()
                                    console.log(users)
                                    break
                                }
                            }
                        }
                        else {
                            console.log(`user doesnt have this quote`)
                            value = value + `,${chosen_quote.name}: 1`
                            sql=`UPDATE users SET quotes = ? WHERE tag= ?`
                            updateData = db.prepare(sql)
                            updates = updateData.run(value, interaction.user.tag)
                            userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${interaction.user.tag}'`).all()
                                    for (userBucksObj of userBucksArr) {
                                        for([key,value] of Object.entries(userBucksObj)) {
                                            userBucks = value
                                        }
                                        userBucks = parseInt(userBucks) + rarity.bucks
                                    }
                            sql = `UPDATE users SET quotebucks='${userBucks}' WHERE tag='${interaction.user.tag}'`
                            updateData = db.prepare(sql)
                            updates = updateData.run()
                        }
                    }
                }
            }
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
                name: rarity.name + ` (${rarity.chance}% Chance)`,
                value: Math.round(rarity.bucks).toString() + ' Quotebucks',
                inline: false
            },
            {
                name: 'Quote by '+ chosen_quote.origin,
                value: chosen_quote.reason,
                inline: false    
            }]);
    return quote_embed
}

function createUpgradeEmbed(id){
    upgrade_embed = new EmbedBuilder()
            .setTitle(upgrades[id].name)
            .setDescription(upgrades[id].description)
            .setColor([0,0,0])
            .setThumbnail(upgrades[id].sprite)
    return upgrade_embed
}


module.exports = {createQuoteEmbed, createUpgradeEmbed}
