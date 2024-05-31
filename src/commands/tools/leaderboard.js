const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder, ComponentType } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const { dumpUsersForLB, dumpUsersForLB_streak } = require('../../util/databaseUtil')

const max_entries = 9
let page = 0
let fields = []
let pages = []
let selected_page = 0
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('quote-leaderboard')
        .setDescription('Leaderboard')
        .addStringOption(option => option.setName('type').setDescription('type of the leaderboard').setChoices({name:'quotebucks', value:'bucks'}, {name: 'streak', value:'streak'}).setRequired(false)),
        async execute(interaction, client){
            type = interaction.options.getString('type')
            console.log(type)
            if(type == null){
                type='bucks'
            }
            switch (type){
                case 'bucks':
                    bucks_lb(interaction)
                case 'streak':
                    streak_lb(interaction)


            }


        }
}

async function bucks_lb(interaction){
    fields = []
    pages = []
    page = 0
    selected_page = 0
    const sorted = quicksort([dumpUsersForLB()])[0]
    for(let i=0;i<sorted.length;i++){
        fields.push({"name": `#${i+1} ${sorted[i].tag}`, "value": `${sorted[i].quotebucks.toString()} quotebucks`})
    }
    if(fields.length <= max_entries){
        pages.push(fields)
    }else{
        let x = 0
        let j = 0
        pages[x] = []
        for(let i=0;i<fields.length;i++){
            pages[x].push(fields[i])
            j++
            if(j > max_entries){
                j = 0
                x++
                pages[x] = []
            }
        }
        
    }
    let id_rand = Math.round(Math.random() * 100)
    embed = new EmbedBuilder()
    .setTitle("Quotebucks Leaderboard")
    .addFields(...pages[selected_page])  
    .setThumbnail('https://media.discordapp.net/attachments/1236736594598428713/1245878492848062495/quote_leaderboard.png?ex=665a5a43&is=665908c3&hm=c432843d4fa126fa6f9dfe67cf675bb43da0a30cb84acbad81cfb34a4bbe1ade&=&format=webp&quality=lossless&width=473&height=473')
    .setFooter({text:`Entries: ${sorted.length}`})
    .setColor([23,20,30])
    const back_id = `${id_rand}-qoute_lb_back`
    const back_btn = new ButtonBuilder()
    .setCustomId(back_id)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success)
    
    const next_id = `${id_rand}-qoute_lb_next`
    const next_btn = new ButtonBuilder()
    .setCustomId(next_id)
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)

    const row = new ActionRowBuilder()
    .addComponents(back_btn)
    .addComponents(next_btn)

    const filter = i => { 
        i.deferUpdate()
        return i.user.id === interaction.user.id

    }
    let r = await interaction.reply({
        embeds: [embed],
        components: [row]
    })
      
    const collector = r.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button, time: 60_000})

    collector.on('collect', async i =>{
        const selection = i.customId
        if(selection == next_id){
            if(pages.length == 1) return
            selected_page++
            if(selected_page >= pages.length) selected_page = 0
            
        }else if(selection == back_id){
            if(pages.length == 1) return
            selected_page--
            if(selected_page <= 0) selected_page = pages.length-1
        }
        embed.setFields(pages[selected_page])
        interaction.editReply({
            embeds: [embed],
            components: [row]
        })

    })

    collector.on('end', async i => {
        await interaction.editReply({ components: []})
    })
}


async function streak_lb(interaction){
    fields = []
    pages = []
    page = 0
    selected_page = 0
    const sorted = quicksort_2([dumpUsersForLB_streak()])[0]
    console.log(sorted)
    for(let i=0;i<sorted.length;i++){
        if(sorted[i].streak == null) continue;
        let text = 'days'
        if(sorted[i].streak == 1) text = 'day'
        fields.push({"name": `#${i+1} ${sorted[i].tag}`, "value": `${sorted[i].streak.toString()} ${text}`})
    }
    if(fields.length <= max_entries){
        pages.push(fields)
    }else{
        let x = 0
        let j = 0
        pages[x] = []
        for(let i=0;i<fields.length;i++){
            pages[x].push(fields[i])
            j++
            if(j > max_entries){
                j = 0
                x++
                pages[x] = []
            }
        }
        
    }
    let id_rand = Math.round(Math.random() * 100)
    embed = new EmbedBuilder()
    .setTitle("Streak Leaderboard")
    .addFields(...pages[selected_page])  
    .setThumbnail('https://media.discordapp.net/attachments/1236736594598428713/1245878492848062495/quote_leaderboard.png?ex=665a5a43&is=665908c3&hm=c432843d4fa126fa6f9dfe67cf675bb43da0a30cb84acbad81cfb34a4bbe1ade&=&format=webp&quality=lossless&width=473&height=473')
    .setFooter({text:`Entries: ${sorted.length}`})
    .setColor([23,20,30])
    const back_id = `${id_rand}-qoute_lb_back_streak`
    const back_btn = new ButtonBuilder()
    .setCustomId(back_id)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success)
    
    const next_id = `${id_rand}-qoute_lb_next_streak`
    const next_btn = new ButtonBuilder()
    .setCustomId(next_id)
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)

    const row = new ActionRowBuilder()
    .addComponents(back_btn)
    .addComponents(next_btn)

    const filter = i => { 
        i.deferUpdate()
        return i.user.id === interaction.user.id

    }
    let r = await interaction.reply({
        embeds: [embed],
        components: [row]
    })
      
    const collector = r.createMessageComponentCollector({ filter: filter, componentType: ComponentType.Button, time: 60_000})

    collector.on('collect', async i =>{
        const selection = i.customId
        if(selection == next_id){
            if(pages.length == 1) return
            selected_page++
            if(selected_page >= pages.length) selected_page = 0
            
        }else if(selection == back_id){
            if(pages.length == 1) return
            selected_page--
            if(selected_page <= 0) selected_page = pages.length-1
        }
        embed.setFields(pages[selected_page])
        interaction.editReply({
            embeds: [embed],
            components: [row]
        })

    })

    collector.on('end', async i => {
        await interaction.editReply({ components: []})
    })
}

const quicksort = (arr) => {
    if(arr.length <= 1)
        return arr

    let pivot = arr[0].quotebucks
    let leftarr = []
    let rightarr = []

    for(let i=1;i<arr.length;i++){
        if(arr[i].quotebucks < pivot){
            leftarr.push(arr[i])
        }else{
            rightarr.push(arr[i])
        }
    }

    return [...quicksort(rightarr), pivot, ...quicksort(leftarr)]
}

const quicksort_2 = (arr) => {
    if(arr.length <= 1)
        return arr

    let pivot = arr[0].streak
    let leftarr = []
    let rightarr = []

    for(let i=1;i<arr.length;i++){
        if(arr[i].streak < pivot){
            leftarr.push(arr[i])
        }else{
            rightarr.push(arr[i])
        }
    }

    return [...quicksort_2(rightarr), pivot, ...quicksort_2(leftarr)]
}