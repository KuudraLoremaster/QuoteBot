const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder } = require('discord.js')
const { execute } = require('../../events/client/ready')
users = require("../tools/users.json")
const fs = require('fs')
const a = (Date.now() + (24*60*60*1000))
asliced = a.toString().slice(0, -3)
cooldown = parseInt(asliced)
const dwagonpfp = 'https://cdn.discordapp.com/attachments/1120808543658975346/1233676156041953300/adae26e38a2f862028a83634911d6c66.webp?ex=662df5f4&is=662ca474&hm=eb1fff7dc0fe2acf4782e29bc7cb326f438f27822500dc6934830742360e3aa2&'
const pixelpfp = 'https://cdn.discordapp.com/attachments/1162056243721031733/1233721641196847236/92ab2b7c3efbb5d470afd9383aed1bf2.webp?ex=662e2050&is=662cced0&hm=e1d2700acf0df38f233ae651aba36c273662b1246917dde0c428167ab55731df&'
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote-daily') 
        .setDescription('get your daily quote'),
    async execute(interaction, client) {
        const unborn = new EmbedBuilder()
        .setTitle('You got Unborn Child!')
        .setDescription(`The next time you can quote is in <t:${cooldown}:R>`)
        .setColor(0x18e1ee)
        .setImage('https://cdn.discordapp.com/attachments/1120808543658975346/1233675769109155920/Screenshot_3.png?ex=662df597&is=662ca417&hm=39c98cfb9e86dadcf38500b3dd4d3e4c0776faa135a136d0b22ba5c75945ae82&')
        .setThumbnail(dwagonpfp)
        .setTimestamp(Date.now())
        .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        })
        .setURL(`https://discord.com/channels/1087889803799969814/1091116865373356142/1150478679856656424`)
        .addFields([{
            name: `Divine`,
            value: `2000 quotebucks`,
            inline:false
        },
    {
        name:`Quote by UwUDwagon`,
        value:`UwUdwagon said this because idfk he's retarded`,
        inline: false
    }]);
    const asshole = new EmbedBuilder()
        .setTitle('You got Fuck me in the asshole!')
        .setDescription(`The next time you can quote is in <t:${cooldown}:R>`)
        .setColor(0xff00ff)
        .setImage('https://cdn.discordapp.com/attachments/1164838382195724388/1230242427374403674/image.png?ex=662dfe4b&is=662caccb&hm=4328c57c830c4bc4a35d715a8298a543944ea8ad7f9c611c7d91ffdc4bed0924&')
        .setThumbnail(pixelpfp)
        .setTimestamp(Date.now())
        .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        })
        .setURL(`https://discord.com/channels/1087889803799969814/1091116865373356142/1150478679856656424`)
        .addFields([{
            name: `Mythic`,
            value: `250 quotebucks`,
            inline:false
        },
    {
        name:`Quote by Pixelated Face`,
        value:`Pixelated Face said this because he is gay, or its a magnus quote probably`,
        inline: false
    }]);
    const quotes = [unborn, asshole]
    gottenQuote = quotes[Math.floor(Math.random() * quotes.length)]
    usersArray = users.users
    numOfUsers = usersArray.length
    for (i = 0; i < numOfUsers; i++) {
        f = gottenQuote.data.title.replace('You got ', '')
        f2 = f.replace('!', '')
        if (usersArray[i].id == interaction.user.id) {
            for (s = 0; s < usersArray[i].quotes.length; s++) {
                for (const [key, value] of Object.entries(usersArray[i].quotes[s])) {
                    o = key
                    v = value
                }
                    console.log(usersArray[i].quotes[s])
                if (o == f2) {
                    k = o
                    l = v
                    console.log(`the quote is a ${k}`)
                    break
                }
            }
            f = gottenQuote.data.title.replace('You got ', '')
            f2 = f.replace('!', '')
            if ((v == f2)) {
                console.log(`f2 is ${f2}`)
                values = [1]
                keys = [f2.toString()]
                quoteObj = {}
                quoteObj[keys[0]] = values[0]
                console.log(`quoteObj is ${quoteObj}`)
                usersArray[i].quotes.push(quoteObj) 
                console.log(`${interaction.user.tag} got a unique boar`)
                console.log('the if ran')
            }
            else { 
                userQuotes = usersArray[i].quotes;
                values = [1 + l] 
                keys = [k]
                quoteObj = {} 
                quoteObj[keys[0]] = values[0]
                userQuotes[s] = quoteObj
                console.log(quoteObj + ' this is quoteObj')
                console.log(userQuotes[s] + ' this is userQuotes')

                console.log("the else ran")
            console.log(userQuotes)
            console.log(userQuotes[s])
            console.log(`${interaction.user.tag} is already registered`)
            usersString = JSON.stringify(users)
            fs.writeFile('../JSBOT/src/commands/tools/users.json', usersString, (error) => {
            if (error) {
                console.error(error)
                throw error
            }
            })
        }
    }
    else {
        console.log(`${interaction.user.tag} isnt registered`)
        keys = [f2]
        values = [1]
        quoteObj = {}
        quoteObj[keys[0]] = values[0]
        schema = {
            id: interaction.user.id,
            quotes: null,
            bucks: null,
            donedaily: true
        }
        schema.quotes = quoteObj
        usersArray.push(schema)
        console.log(`${usersArray} users`)
        usersString = JSON.stringify(users)
        console.log(`users string ${usersString}`)
        fs.writeFile('../JSBOT/src/commands/tools/users.json', usersString, (error) => {
            if (error) {
                console.error(error)
                throw error
            }
            })
    }
    await interaction.reply({
        embeds: [gottenQuote]
    })
    }
    
}}