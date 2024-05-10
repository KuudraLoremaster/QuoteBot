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
const { createUpgradeEmbed_Collection } = require('../../util/quoteEmbed');
const { getQuoteID, useUpgrade } = require('../../util/databaseUtil');
const upgrades = require('../../json/upgrades.json')[0]
const db = new Database('users.db', { verbose: console.log });

var upgrade_options = []
for(let i=0; i<Object.keys(upgrades).length;i++){
    var op = {}
    op["name"] = upgrades[i].name
    op["value"] = i.toString()
    upgrade_options.push(op)
}

console.log(upgrade_options)


module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName('use-upgrade')
    .setDescription('use your upgrades')
    .addStringOption(option => option.setName('upgrade').setDescription('name of the upgrade').setChoices(...upgrade_options).setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('amount of upgrades to use').setRequired(false).setMinValue(1).setMaxValue(9999)),
    async execute(interaction, client){
        user = interaction.user
        amount = interaction.options.getInteger('amount')
        upgrade = interaction.options.getString('upgrade')
        if(amount == 0 || amount == null) amount = 1
        console.log(upgrade)

        let userUpgrades = JSON.parse(db.prepare(`SELECT upgrades FROM users WHERE tag='${user.tag}'`).get().upgrades)
        if(userUpgrades[upgrade] != null){
            if(userUpgrades[upgrade] >= amount){
                console.log(amount)
                    useUpgrade(upgrade, interaction.user.id, amount)
                    await interaction.reply({content: `Gained `, ephemeral: true})
            }else{
                await interaction.reply({content: `You dont have enough of that upgrade`, ephemeral: true})
            }
        }else{
            await interaction.reply({content: `You dont have that upgrade`, ephemeral: true})
        }
        
    }
}

