const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, BaseGuildEmoji, roleMention, PermissionFlagsBits } = require('discord.js')
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
    cooldown: 60,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('refresh commands (has to be used once)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client){
        (async () => {
            try {

                const rest = new REST().setToken(process.env.token);
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands('1235165635739389983', interaction.guild.id),
                    { body: client.commandArray },
                );
        
           
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();

        await interaction.reply("Commands Reloaded!")
    }   
           
      
}

