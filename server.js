const http = require('http')
const debug = require('debug')('node-angular')
const app = require('./backend/app');
// const socketIO = require('socket.io');
const path = require("path")

const express = require('express');


const normalizePort = value => {
    var port = parseInt(value, 10);
    if (isNaN(port)) {
        return value
    }
    if (port >= 0) {
        return port
    }
    return false;
}

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privilegas");
            process.exit(1);
        case "EADDRINUSE":
            console.error(bind + " is already  in use");
            process.exit(1);
            break;
        default:
            throw error;
    }

}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
}


// const port = normalizePort(process.env.Port || 5000)

var port = process.env.PORT || 5000;

app.set('port', port);

const server = http.createServer(app);

// var io = socketIO(server);
// require('./backend/utils/socket')(io);

server.on("error", onError);
server.on("listening", onListening);

// require("./bot/index")
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => { console.log("Running...") });
