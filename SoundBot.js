const Discord = require('discord.js');
var bot = new Discord.Client();
const Config = require('config')


bot.login(Config.get('token'));

bot.on("ready", () => {
  console.log("I am ready!");
});

bot.on("message", (message) => {
    if(message.author.username !== bot.user.username && message.content.startsWith("!")) {
    message.channel.send("!pong!");
  }
});