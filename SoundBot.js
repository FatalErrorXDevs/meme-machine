const Discord = require('discord.js');
var bot = new Discord.Client({autoReconnect:true});
const Config = require('config')
const MessageHandler = require('./MessageHandler.js');


class SoundBot extends Discord.Client{
constructor(){
    super();
    this.messageHandler = new MessageHandler(this);
    this.login(Config.get('token'));
    this._addEventListeners();
}

  _addEventListeners(){
    this.on('message',this._messageListener);
}

  _messageListener(message) {
    if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
    if (!message.content.startsWith('!')) return; // Abort when not prefix
    this.messageHandler.handle(message);
  }
}
module.exports = new SoundBot();