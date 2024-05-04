const { log } = require("./logger")


function OnUncaughtException(err){
    try{
        log(err)
    }catch(e){
        console.error(e)
        console.error(err)
    }

}

module.exports = {OnUncaughtException}