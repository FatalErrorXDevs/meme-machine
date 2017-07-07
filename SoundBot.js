const Discord = require('discord.js');
var client = new Discord.Client();
const Config = require('config')


client.login(Config.get('token'));

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  }
});