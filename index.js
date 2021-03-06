//Initial setup - Express, HTTP, Socket.io
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 8082; 

//Game Server
var GameServer = require('./server');
server = new GameServer(io, http, app);

//Game Server setup
server.loadModule(require('./modules/menu-module'));
server.loadModule(require('./modules/game-module'));


//Express Setup
app.use(express.static('webfiles')); 
app.get('/', (req, res) => 
{
    res.sendFile(__dirname + '/index.html');
});






server.startServer(port);

