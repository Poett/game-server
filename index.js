//Initial setup - Express, HTTP, Socket.io
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8082; 

//Game Server
var GameServer = require('./server');
server = new GameServer(io, http, app);

//Game Server setup
server.loadModule(require('./modules/menu-module'));


//Express Setup
app.use(express.static('webfiles')); 
app.get('/', (req, res) => 
{
    res.sendFile(__dirname + '/index.html');
});






server.startServer(port);

