const config = require('config');
var soundbot = require('./SoundBot.js')
var http = require('http'),
    express = require('express'),
    fs = require('fs'),
    path = require('path');

var app = express();
app.use(express.static(__dirname + '/app/components'));
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


var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log("bot commander connected");


    socket.on('getChannels', function() {
        var channels = soundbot.channels.filterArray(voice => voice.type == "voice" && voice.name != "AFK");
        socket.emit('loadChannels', channels);
    });
    
    socket.on('getSounds', function(){
        socket.emit('loadDisplay', soundbot.util.getSounds());
    })

    socket.on('disconnect', function() {
        console.log('bot commander disconnected');
   });
   socket.on('play', function(name, channel){
       console.log("play pressed for sound " + name + 'supposed to play in channel ' + channel );

       soundbot.addToQueueFromGUI(channel, name);
       soundbot.playSoundQueue();

   });
});


server.listen(3001, function() {
    console.log('Listening on port 3001...');    
});