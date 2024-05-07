const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, BaseGuildEmoji, roleMention } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs');
const { error } = require('console');
const sqlite3 = require('sqlite3').verbose();
const betterSqlite = require('better-sqlite3')
let sql;
const a = (Date.now() + (24*60*60*1000))

asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)
const quotes = require('./quotes.json').quotes
const rarities = require("./rarities.json").rarities
const q_rarities = require('./quotes_rarities.json').rarities
const pfps = require('./pfps.json').pfps
const Database = require('better-sqlite3');
const db = new Database('users.db', { verbose: console.log });
query = `CREATE TABLE users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks, tag)` 
// db.exec(query)
sql = `INSERT INTO users(userID, quotes, quotebucks) VALUES (?,?,?)`
// db.run(sql,[317745407599968257, null, null])
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote-daily')
        .setDescription('get your daily quote'),
        async execute(interaction, client){
            rarity_roll = rollRarity()
            rarity = rarities[rarity_roll]
            num = Math.floor(Math.random() * (q_rarities[rarity_roll].length))
            chosen_quote = quotes[0][q_rarities[rarity_roll][num]]
            sql = `SELECT * FROM users WHERE tag='${interaction.user.tag}'`
            d = []
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

const rarity_mult = [ // rarity_id : weight (please make sure it adds up to 1 if you change any of the numbers)
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
