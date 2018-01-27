const config = require('config');
require('./SoundBot.js')
var http = require('http'),
    express = require('express'),
    fs = require('fs'),
    path = require('path');

var app = express();
app.use(express.static(__dirname + '/components'));
app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
var server = http.createServer(app);

app.get('/', function(req, res) {
    res.sendfile('app/index.html');
});

console.log('Use the following URL to let the bot join your server!');
console.log(
    `https://discordapp.com/oauth2/authorize?client_id=${config.get('client_id')}&scope=bot`
);

server.listen(3001, function() {
    console.log('Listening on port 3001...');    
});