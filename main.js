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


var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
    console.log("bot commander connected");
    var watcher = fs.watch('files', function (event, filename) {
        if (fs.existsSync('files/' + filename)) {
            socket.emit('change', dirTree('files/' + filename));
        }
    });
    socket.on('disconnect', function() {
      watcher.close(); 
   });
});


server.listen(3001, function() {
    console.log('Listening on port 3001...');    
});