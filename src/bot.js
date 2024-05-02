require('dotenv').config()
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
var rarity_json = require('./commands/tools/quotes_rarities.json')
const quotes = require('./commands/tools/quotes.json').quotes

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection()
client.commandArray = [];

const force_reload_rarity = false

if(quotes.length != rarity_json.count){
  reload_rarity()
}

// this is so we only have to set the rarity on the quotes json
function reload_rarity(){
  var r = {
    "rarities":{
      "0": {},
      "1": {},
      "2": {},
      "3": {},
      "4": {},
      "5": {},
      "6": {}
    },
    "count": 0
  };
  const q = quotes[0]
  r.count = quotes.length
  for(let i = 0; i < quotes.length; i++){
    r[q[i.toString()].rarity] = i.toString()
  }

  var json = JSON.stringify(r)
  console.log(r)
  console.log(json)
  fs.writeFile('./commands/tools/quotes_rarities.json', json, 'utf8')
}

const functionFolders = fs.readdirSync('./src/functions')
for (const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token)
