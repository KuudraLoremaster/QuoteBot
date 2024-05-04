
function log(msg){
    let date = new Date()
    let d = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `
    console.log(d + msg)
}

module.exports = {log}