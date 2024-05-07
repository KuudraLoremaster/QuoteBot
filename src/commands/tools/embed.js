const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs')
const a = (Date.now() + (24*60*60*1000))

asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)

const {createQuoteEmbed} = require('../../util/quoteEmbed')
const { log } = require('../../util/logger')
const quotes = require('../../json/quotes.json').quotes
const rarities = require("../../json/rarities.json").rarities
const q_rarities = require('../../json/quotes_rarities.json').rarities
const pfps = require('../../json/pfps.json').pfps
const rarity_mult = require('../../json/globals.json').rarity_weight
const Database = require('better-sqlite3');
const db = new Database('users.db', { verbose: console.log });
query = `CREATE TABLE users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks, tag)` 
// db.exec(query)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('quote-daily')
    .setDescription('get your daily quote'),
    async execute(interaction, client
            
            rarity_roll = rollRarity()
            rarity = rarities[rarity_roll]
            
            num = Math.floor(Math.random() * (q_rarities[rarity_roll].length))
            quote_embed = createQuoteEmbed(q_rarities[rarity_roll][num], cooldown, interaction)
            
            await interaction.reply({
                embeds: [quote_embed]
            })
        }
}




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

