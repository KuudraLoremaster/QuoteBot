
const Database = require('better-sqlite3');
const db = new Database('users.db');
const upgrades = require('../json/upgrades.json')[0]
const quotes = require('../json/quotes.json').quotes
const j_rarity = require('../json/rarities.json').rarities
const fs = require('fs');
const { log } = require('./logger');
const { createQuoteEmbed, createUpgradeEmbed } = require('./quoteEmbed');

new_query = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks,tag, daily INTEGER DEFAULT 0, upgrades, luck_mult INTEGER DEFAULT 1, money_mult INTEGER DEFAULT 1)'

function createDB(){
    db.exec(new_query)


   
}

function addQuote(id, cooldown, interaction, ignore_daily=false){
    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]
    if(getDaily(interaction.user.id) == 1 && ignore_daily == false){
        return -1
    }
    if(ignore_daily == false){
        useDaily(interaction.user.id)
    }

    sql = `SELECT * FROM users WHERE tag='${interaction.user.tag}'`
            const userArray = db.prepare(sql).all();
            if (userArray.length == 0) {

                data = { userID: interaction.user.id, quotes : `${chosen_quote.name}: 1`, quotebucks: rarity.bucks, tag: interaction.user.tag}
                sql=`INSERT INTO users (userID,quotes,quotebucks,tag,daily) VALUES (?,?,?,?,?)`
                quoteString = `${chosen_quote.name}: 1`
                let insertData = db.prepare(sql)
                insertData.run(data.userID, data.quotes, data.quotebucks, data.tag, 1)
            }
            else {
                let userQuotesArr = db.prepare(`SELECT quotes FROM users WHERE tag='${interaction.user.tag}'`).all()
                for (userQuotes of userQuotesArr) {
                    for ([key,value] of Object.entries(userQuotes)) {
                        if (value.includes(chosen_quote.name)) {
                            val2 = value.split(',')
                            for (userQuote of val2) {
                                if (userQuote.includes(chosen_quote.name)) {
                                    userQuote = userQuote.split(':')
                                    userQuote[1] = parseInt(userQuote[1]) + 1
                                    index = val2.findIndex(element => element.startsWith(`${chosen_quote.name}`));
                               
                                    userQuote = userQuote.join(':')
                                    userQuote = userQuote.toString()

                                    val2[index] = userQuote
                       
                                    sql = `UPDATE users SET quotes ='${val2}' WHERE tag= '${interaction.user.tag}'`
                                    updateData = db.prepare(sql)
                                    updates = updateData.run()
                                    userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${interaction.user.tag}'`).all()
                                    for (userBucksObj of userBucksArr) {
                                        for([key,value] of Object.entries(userBucksObj)) {
                                            userBucks = value
                                        }
                                        userBucks = parseInt(userBucks) + rarity.bucks
                                    }                      
                                    sql = `UPDATE users SET quotebucks='${userBucks}' WHERE tag='${interaction.user.tag}'`
                                    updateData = db.prepare(sql)
                                    updateData.run()
                                    users = db.prepare(`SELECT * FROM users`).all()
                            
                                    break
                                }
                            }
                        }
                        else {
                          
                            value = value + `,${chosen_quote.name}: 1`
                            sql=`UPDATE users SET quotes = ? WHERE tag= ?`
                            updateData = db.prepare(sql)
                            updates = updateData.run(value, interaction.user.tag)
                            userBucksArr = db.prepare(`SELECT quotebucks FROM users WHERE tag='${interaction.user.tag}'`).all()
                                    for (userBucksObj of userBucksArr) {
                                        for([key,value] of Object.entries(userBucksObj)) {
                                            userBucks = value
                                        }
                                        userBucks = parseInt(userBucks) + rarity.bucks
                                    }
                            sql = `UPDATE users SET quotebucks='${userBucks}' WHERE tag='${interaction.user.tag}'`
                            updateData = db.prepare(sql)
                            updates = updateData.run()
                        }
                    }
                }
            }
        return createQuoteEmbed(id, cooldown, interaction)
}

function addUpgrade(upgrade_id, user_id){
    upgrade_id = upgrade_id.toString()
    let x = db.prepare(`SELECT upgrades FROM users WHERE userID='${user_id}'`).get().upgrades
    if(x.toString() == '[object Object]'){
        x = null
    }
    if(x == null){
        db.prepare(`UPDATE users SET upgrades='{"${upgrade_id}":1}' WHERE userID='${user_id}'`).run()
        
    }else{
        console.log(x)
        let upgrades = JSON.parse(x)
        if (upgrades[upgrade_id] != null){
            upgrades[upgrade_id] += 1 
            console.log(upgrades)
            db.prepare(`UPDATE users SET upgrades='${JSON.stringify(upgrades)}' WHERE userID='${user_id}'`).run()
        }

    }

    return createUpgradeEmbed(upgrade_id)
}

function useUpgrade(upgrade_id, user_id){

}

function getDaily(user_id){
    let x = db.prepare(`SELECT daily FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return null
    }
    return x.daily
}

function useDaily(user_id){
  db.exec(`UPDATE users SET daily=1 WHERE userID='${user_id}'`)
}

function resetDaily(){
    db.prepare('UPDATE users SET daily=0').run()
}

function getLuckMult(user_id){
    let x = db.prepare(`SELECT luck_mult FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return null
    }
    return x.luck_mult
}

function getMoneyMult(user_id){
    let x = db.prepare(`SELECT money_mult FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return null
    }
    return x.money_mult
}

function getDB(){
    return db
}


module.exports = {createDB, addUpgrade, useUpgrade, getDaily, getLuckMult, getMoneyMult, getDB, addQuote, resetDaily}