const http = require('http')    
const path = require('path')    
const fs = require('fs')       
const fsPromises = require('fs').promises    
const logEvents = require('./middleware/logger')  
const PORT = 5000
const EventEmitter = require('events')       
class Emitter extends EventEmitter {}
const eventEmitter = new Emitter()

eventEmitter.on('log', (message, fileName) => {
    logEvents(message, fileName)
})
const serveFile = async (fileName, contentType, response) => {
    try{
    let data = await fsPromises.readFile(fileName, contentType.includes('image')?'':'utf-8')
    if(contentType === 'application/json'){
        data = JSON.parse(data)
    }
    response.writeHead(fileName.includes('page-not-found.html')?404:200, contentType);
    response.end(contentType === 'application/json'?JSON.stringify(data):data)
    }
    catch(err){
        const errMessage = `${err.name}\t${err.message}`
        console.log(errMessage);
        eventEmitter.emit('log', errMessage, 'err_logs.txt')
        response.statusCode = 500
        response.end()
    }
}
const server = http.createServer((req,res) => {
    const message = `${req.method}\t${req.url}\n`
    console.log(message);
    const extension = path.extname(req.url)
    eventEmitter.emit('log', message, 'logs.txt')
    let contentType;
    switch(extension){
        case '.css': contentType = 'text/css'
        break;
        case '.png': contentType = 'image/png'
        break;
        case '.jpg': contentType = 'image/jpeg'
        break;
        case '.json': contentType = 'application/json'
        break;
        case '.js': contentType = 'text/javascript'
        break;
        default: contentType = 'text/html'
    }

    let filePath;
    if(contentType === 'text/html' && req.url === '/'){
        filePath = path.join(__dirname, 'views', 'index.html')
    }
    else if(contentType.includes('image')){
        filePath = path.join(__dirname, req.url);
    }
    else if(req.url.includes('?')){
        filePath = path.join(__dirname, 'views', req.url.slice(0, req.url.indexOf('?')))
    }
    else{
        filePath = path.join(__dirname, 'views', req.url)
    }

    if(!extension && req.url !== '/') filePath += '.html'

    if(fs.existsSync(filePath)){
        serveFile(filePath, contentType, res);
    }
    else{
        switch(path.basename(filePath)){
            case 'newpage.html': 
            case 'homepage.html': res.writeHead(301, {'Location':'/index.html'})
                res.end();
                break;
            default: serveFile(path.join(__dirname, 'views', 'page-not-found.html'), contentType, res);
        }
    }
})
server.listen(PORT, () => {
    console.log("Server is running on "+PORT);
})
