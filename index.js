var express = require('express');
var app = express();
var http = require('http').Server(app);
const port = 8082;

app.use(express.static('webfiles')); //Open Webfiles for serving to client

app.get('/', (req, res) => 
{
    res.sendFile(__dirname + '/index.html');
});



http.listen(port, () => 
{
    console.log("Listening on port " + port);
});