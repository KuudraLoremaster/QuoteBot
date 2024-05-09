const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const fs = require('fs')
const a = (Date.now() + (24*60*60*1000))

asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)


const quotes = require('../../json/quotes.json').quotes

const {createQuoteEmbed} = require('../../util/quoteEmbed')
const { addQuote } = require('../../util/databaseUtil')
const admins = require('../../json/globals.json').admins
const count = require('../../json/quotes_rarities.json').count

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give-quote')
        .setDescription('free quotes!!! (real)')
        .addIntegerOption(option => option.setName('quote-id').setDescription("ID of the quote").setRequired(true)),
        async execute(interaction, client){
            id = interaction.options.getInteger('quote-id').toString()
            is_admin = false            

            for(let i = 0; i < admins.length; i++){
                if(admins[i] == interaction.user.id){
                    is_admin = true
                    break
                }
                
            }

            if(!is_admin){
                await interaction.reply({content:"You don't have permission to use this command.", ephemeral: true})
                return

            }

            if(id < 0 || id > count-1){
                await interaction.reply({content:`Please choose a number between 0 and ${count-1}.`, ephemeral: true})
                return
            }

            chosen_quote = quotes[0][id]
            
            quote_embed = addQuote(id, cooldown, interaction, true)


            await interaction.reply({
                embeds: [quote_embed]
            })
        }
}

