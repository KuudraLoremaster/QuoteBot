const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, BaseGuildEmoji, roleMention, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs');
const { error } = require('console');
const sqlite3 = require('sqlite3').verbose;
const betterSqlite = require('better-sqlite3')
let query;
// const db =  new sqlite3.Database('src/commands/tools/users.db',sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err)
// })
const Database = require('better-sqlite3');
const { createQuoteEmbed, createQuoteEmbed_Collection } = require('../../util/quoteEmbed');
const { getQuoteID } = require('../../util/databaseUtil');
const db = new Database('users.db', { verbose: console.log });
// query = `CREATE TABLE users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks, tag)` 
// db.exec(query)
 query = 'SELECT * FROM users'
const users = db.prepare(query).all()
console.log(users)

const quotes_per_page = 7
let all_quotes = []
var unique_quotes = 0
var selected_quote = 0
var view_mode = false
var unsorted_quotes = []
module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('quote-collection')
    .setDescription('view your collection of quotes')
    .addUserOption(option => option.setName('user').setDescription('user to view collection').setRequired(false)),
    async execute(interaction, client){
        user = interaction.options.getUser('user')
        console.log(user)
        if(user == null){
            user = interaction.user
        }

        userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${user.tag}'`).all()
        console.log(userBucksArr)
        for (userBucksObj of userBucksArr) {
            for([key,value] of Object.entries(userBucksObj)) {
                userBucks = value
            }
        }  
        let userQuotesArr = db.prepare(`SELECT quotes FROM users WHERE tag='${user.tag}'`).all()
        coll = new EmbedBuilder()
            .setTitle(`${user.tag}'s Quote Collection!`)
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .addFields([{
                name: 'Bucks: ',
                value: userBucks.toString() + ' quotebucks',
                inline: false
            }])
            let group = []
        userQuotesArr.forEach(userQuote => {
            for([key,value] of Object.entries(userQuote)) {
            }
            
            rows = value.split(',') 
            rows.forEach((row) => {
                row = row.split(':')
               
                // console.log(row.name, row.points)
                group.push(row)
                unsorted_quotes.push(row[0])
                if(group.length >= quotes_per_page){
                    unique_quotes += group.length
                    all_quotes.push(group)
                    
                    group = []
                }
               
            })
            if(group.length > 0){
                unique_quotes += group.length
                all_quotes.push(group)
            }
        });   
            console.log(all_quotes)
            let pages = []
            all_quotes.forEach(q => {
                let page = new EmbedBuilder()
                .setTitle(`${user.tag}'s Quote Collection!`)
                .setThumbnail(user.displayAvatarURL())
                .setColor([23,20,30])
                .setFooter({text: "Unique Quotes: "+ unique_quotes.toString()})
                .addFields([{
                    name: 'Bucks: ',
                    value: userBucks.toString() + ' quotebucks',
                    inline: false
                }])
                q.forEach(e => {
                 page.addFields([{
                    name: e[0],
                    value: e[1].toString(),
                    inline: false
                 }])
                });
                pages.push(page)
            });
            let id_rand = Math.round(Math.random() * 100)
            const back_btn = new ButtonBuilder()
                .setCustomId(`${id_rand}-quote_col_back`)
                .setLabel('Back')
                .setStyle(ButtonStyle.Success)

            const next_btn = new ButtonBuilder()
            .setCustomId(`${id_rand}-quote_col_next`)
            .setLabel('Next')
            .setStyle(ButtonStyle.Success)

         
            
            const view_btn = new ButtonBuilder()
            .setCustomId(`${id_rand}-quote_col_view`)
            .setLabel('View')
            .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder()
            .addComponents(back_btn)
            .addComponents(view_btn)
            .addComponents(next_btn)
            

            const filter = i => { 
                i.deferUpdate()
                return i.user.id === interaction.user.id

            }
            current_page = 0
            const r = await interaction.reply({
                embeds: [pages[current_page]],
                components: [row]
            })
            
            const collector = r.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button, time: 60_000})

            collector.on('collect', async i =>{
                    const selection = i.customId
                    if(selection === `${id_rand}-quote_col_next`){
                        if(view_mode){
                            if(selected_quote < unique_quotes-1){
                                selected_quote += 1
                            }else{
                                selected_quote = 0
                            }
                        interaction.editReply({embeds: [createQuoteEmbed_Collection(getQuoteID(unsorted_quotes[selected_quote]),user)], components: [row]})
                        }else{
                            if(current_page < pages.length-1){
                                current_page++
                            }else{
                                current_page = 0
                            }
                            await interaction.editReply({embeds: [pages[current_page]], components: [row]})
                        }
                    }else if(selection === `${id_rand}-quote_col_back`){
                        if(view_mode){
                            if(selected_quote > 0){
                                selected_quote -= 1
                            }else{
                                selected_quote = unique_quotes-1
                            }
                            interaction.editReply({embeds: [createQuoteEmbed_Collection(getQuoteID(unsorted_quotes[selected_quote]),user)], components: [row]})
                        }else{
                            if(current_page > 0){
                                current_page--
                            }else{
                                current_page = pages.length-1
                            }
                            interaction.editReply({embeds: [createQuoteEmbed_Collection(getQuoteID(unsorted_quotes[selected_quote]),user)], components: [row]})
                        }
                    }else if(selection === `${id_rand}-quote_col_view`){
                        if(view_mode){
                            view_mode = false
                            await interaction.editReply({embeds: [pages[current_page]], components: [row]})
                        }else{
                            view_mode = true
                            await interaction.editReply({embeds: [createQuoteEmbed(getQuoteID(unsorted_quotes[selected_quote]),1,interaction, false)], components: [row]})

                        }
                    }
                    
                
            })

            collector.on('end', async i => {
                await interaction.editReply({ components: []})
            })
        }
}

