const date = require('date-fns');
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, fileName) => {
    const dateTime = `${date.format(new Date(), 'MMM dd, yyyy\tHH:mm:ss')}`
    try{
    if(!fs.existsSync('log')){
        await fsPromises.mkdir('log')
    }
    const PATH = `${path.join(__dirname,'..','log', fileName)}`
    const entry = `${dateTime}\t${message}\n`
    await fsPromises.appendFile(PATH, entry)
    }
    catch(err){
        console.log(err.name, err.message, 'Error Caught!!!');
    }
}

module.exports = logEvents;