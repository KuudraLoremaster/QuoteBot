require('dotenv').config()
const { token } = process.env;
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
var rarity_json = require('./commands/tools/quotes_rarities.json');
const { OnUncaughtException } = require('./util/GlobalErrorHandler');
const quotes = require('./commands/tools/quotes.json').quotes

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.commands = new Collection()
client.commandArray = [];

const force_reload_rarity = false

if(Object.keys(quotes[0]).length != rarity_json.count){
  console.log('Reloading Quote Rarities')
  reload_rarity()
}

// this is so we only have to set the rarity on the quotes json
function reload_rarity(){
  var r = {
    "rarities":{
      "0": [],
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": []
    },
    "count": 0
  };
  const q = quotes[0]
  r.count = Object.keys(quotes[0]).length
  for(let i = 0; i < r.count; i++){
    
    r.rarities[q[i.toString()].rarity.toString()].push(i.toString())
    
  }

  var json = JSON.stringify(r)
  fs.writeFile('./src/commands/tools/quotes_rarities.json', json, (err) => {if(err){throw err}})
}

const functionFolders = fs.readdirSync('./src/functions')
for (const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}


['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => process.on(signal, () =>{
  client.destroy()
  process.exit(0)
}))

process.on("uncaughtException", (err) =>{
  OnUncaughtException(err)
})

client.handleEvents();
client.handleCommands();
client.login(token)
