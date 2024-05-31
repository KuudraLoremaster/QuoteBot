
const Database = require('better-sqlite3');
const db = new Database('users.db');
const upgrades = require('../json/upgrades.json')[0]
const quotes = require('../json/quotes.json').quotes
const j_rarity = require('../json/rarities.json').rarities
const fs = require('fs');
const { log } = require('./logger');
const { createQuoteEmbed, createUpgradeEmbed } = require('./quoteEmbed');
const admins = require('../json/globals.json').admins

new_query = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, userID, quotes, quotebucks,tag, daily INTEGER DEFAULT 0, upgrades, luck_mult INTEGER DEFAULT 1, money_mult INTEGER DEFAULT 1, q_daily INTEGER DEFAULT 0, streak INTEGER DEFAULT 0, last_daily_t INTEGER DEFAULT 0)'

function createDB(){
    db.exec(new_query)
}

function isUserAdmin(id){
    for(let i = 0; i < admins.length; i++){
        if(admins[i] == id){
            return true
        }
        
    }

    return false
}

function getStats(id){
    return db.prepare(`SELECT luck_mult,money_mult,q_daily,streak FROM users WHERE userID='${id}'`).get()
    
}

function addQuote(id, cooldown, interaction, ignore_daily=false){
    const chosen_quote = quotes[0][id]
    const rarity = j_rarity[chosen_quote.rarity]
    if((getDaily(interaction.user.id) == 1 && ignore_daily == false) && !isUserAdmin(interaction.user.id.toString())){
        return -1
    }
    
    configStreak(interaction.user.id)

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
        var bucks = db.prepare(`SELECT quotebucks FROM users WHERE userID='${interaction.user.id}'`).get().quotebucks
        db.prepare(`UPDATE users SET quotebucks=${bucks +  rarity.bucks*getMoneyMult(interaction.user.id)} WHERE userID='${interaction.user.id}'`).run
        useDaily(interaction.user.id)

        resetMult(interaction.user.id)
        return createQuoteEmbed(id, cooldown, interaction)
}

function addUpgrade(upgrade_id, user_id, amount=1){
    upgrade_id = upgrade_id.toString()
    let x = db.prepare(`SELECT upgrades FROM users WHERE userID='${user_id}'`).get().upgrades
    if(x == null){
        db.prepare(`UPDATE users SET upgrades='{"${upgrade_id}":${amount}}' WHERE userID='${user_id}'`).run()
        
    }else{
        console.log(x)
        let upgrades = JSON.parse(x)
        if (upgrades[upgrade_id] != null){
            upgrades[upgrade_id] += amount
            console.log(upgrades)
            db.prepare(`UPDATE users SET upgrades='${JSON.stringify(upgrades)}' WHERE userID='${user_id}'`).run()
        }else{
            upgrades[upgrade_id] = amount
            console.log(upgrades)
            db.prepare(`UPDATE users SET upgrades='${JSON.stringify(upgrades)}' WHERE userID='${user_id}'`).run()
        }

    }

    return createUpgradeEmbed(upgrade_id, amount)
}

function useUpgrade(upgrade_id, user_id, amount){
    let x = JSON.parse(db.prepare(`SELECT upgrades FROM users WHERE userID='${user_id}'`).get().upgrades)
    if(x == null || x[upgrade_id] == null) return
    if(x[upgrade_id] == amount) delete x[upgrade_id]
    else x[upgrade_id] -= amount
    console.log(x)
    var luck_mult = getLuckMult(user_id) + (upgrades[upgrade_id].luck_mult * amount)
    var money_mult = getMoneyMult(user_id) + (upgrades[upgrade_id].money_mult * amount)
    if(luck_mult <= 0) luck_mult = 1
    if(money_mult <= 0) money_mult = 1

    db.prepare(`UPDATE users SET upgrades='${JSON.stringify(x)}',luck_mult=${luck_mult},money_mult=${money_mult} WHERE userID='${user_id}'`).run()
}

function getDaily(user_id){
    let x = db.prepare(`SELECT daily FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return null
    }
    return x.daily
}

function useDaily(user_id){
    let q_daily = db.prepare(`SELECT q_daily FROM users WHERE userID='${user_id}'`).get()
    if(q_daily == null){
        q_daily = 0
    }
    q_daily = q_daily.q_daily
    db.prepare(`UPDATE users SET daily=1,q_daily=${q_daily+1} WHERE userID='${user_id}'`).run()
}

function resetDaily(){
    db.prepare('UPDATE users SET daily=0').run()
}

function getLuckMult(user_id){
    let x = db.prepare(`SELECT luck_mult FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return 1
    }
    return x.luck_mult
}

function resetMult(user_id){
    db.prepare(`UPDATE users SET luck_mult=1,money_mult=1 WHERE userID='${user_id}'`).run()
}

function getMoneyMult(user_id){
    let x = db.prepare(`SELECT money_mult FROM users WHERE userID='${user_id}'`).get()
    if(x == null){
        return 1
    }
    return x.money_mult
}

function getDB(){
    return db
}

function getQuoteID(name){
    for(let i=0; i < Object.keys(quotes[0]).length; i++){
        if(name == quotes[0][i].name){
            return i
        }


    }
    return 8 // failsafe
}

function configStreak(user_id){
    const q = db.prepare(`SELECT streak,last_daily_t FROM users WHERE userID='${user_id}'`).get()
    let streak = q.streak
    let t = q.last_daily_t
    console.log(streak)
    console.log(t)
    if(streak == null || t == null){
        db.prepare(`UPDATE users SET streak=${1},last_daily_t=${Date.now()} WHERE userID='${user_id}'`).run()
    
    }
    if(Date.now() >= t+172800){
        db.prepare(`UPDATE users SET streak=1,last_daily_t=${Date.now()} WHERE userID='${user_id}'`).run()
        return
    }
    db.prepare(`UPDATE users SET streak=${streak+1},last_daily_t=${Date.now()} WHERE userID='${user_id}'`).run()
}

function getStreak(user_id){
    return db.prepare(`SELECT streak FROM users WHERE userID='${user_id}'`).all().streak
}

function dumpUsersForLB(){
    return db.prepare('SELECT tag, quotebucks FROM users').all()

}

function dumpUsersForLB_streak(){
    return db.prepare('SELECT tag, streak FROM users').all()

}



module.exports = {createDB, addUpgrade, useUpgrade, configStreak, getStreak, getDaily, getLuckMult, getMoneyMult, getDB, dumpUsersForLB, resetMult, addQuote, resetDaily, getQuoteID, getStats, dumpUsersForLB_streak}