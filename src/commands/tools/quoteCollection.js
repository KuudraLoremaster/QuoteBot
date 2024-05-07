const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, BaseGuildEmoji, roleMention } = require('discord.js')
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
const db = new Database('users.db', { verbose: console.log });
// query = `CREATE TABLE users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks, tag)` 
// db.exec(query)
 query = 'SELECT * FROM users'
const users = db.prepare(query).all()
console.log(users)


module.exports = {
    data: new SlashCommandBuilder()
    .setName('quote-collection')
    .setDescription('view your collection of quotes'),
    async execute(interaction, client){
        userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${interaction.user.tag}'`).all()
        for (userBucksObj of userBucksArr) {
            for([key,value] of Object.entries(userBucksObj)) {
                userBucks = value
            }
        }  
        let userQuotesArr = db.prepare(`SELECT quotes FROM users WHERE tag='${interaction.user.tag}'`).all()
        coll = new EmbedBuilder()
            .setTitle(`${interaction.user.tag}'s Quote Collection!`)
            .addFields([{
                name: 'Bucks: ',
                value: userBucks.toString() + ' quotebucks',
                inline: false
            }])
        userQuotesArr.forEach(userQuote => {
            for([key,value] of Object.entries(userQuote)) {
                console.log(value)
            }
            rows = value.split(',')
            rows.forEach((row) => {
                row = row.split(':')
                obj = {
                    name: row[0],
                    value: row[1]
                }
                for ([key,value] of Object.entries(obj)) {

                }
                // console.log(row.name, row.points)
                console.log(row)
                coll.addFields(obj);
            })
        });   
            await interaction.reply({
                embeds: [coll]
            })
        }
}

