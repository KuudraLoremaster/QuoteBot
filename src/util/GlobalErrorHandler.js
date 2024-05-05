
function OnUncaughtException(err){
   
    try{
        console.error(err)
    }catch(e){
        console.error(e)
        console.error(err)
    }

}

module.exports = {OnUncaughtException}