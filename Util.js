const fs = require('fs');
const https = require('https');

class Util{
constructor(){

}

  commandsList() {
    return [
      '```',
      '!commands              Show this message',
      '!sounds                Show available sounds',
      '!<sound>               Play the specified sound',
      '!random                Play random sound',
      '!stop                  Stop playing and clear queue',
      '!add                   Add the attached sound',
      '!rename <old> <new>    Rename specified sound',
      '!remove <sound>        Remove specified sound',
      '```'
    ].join('\n');
  }

    addSounds(attachments, channel) {
    attachments.forEach(attachment => this._addSound(attachment, channel));
  }

 _addSound(attachment, channel) {
    if (attachment.filesize > config.get('size')) {
      channel.sendMessage(`${attachment.filename.split('.')[0]} is too big!`);
      return;
    }

    if (!config.get('extensions').some(ext => attachment.filename.endsWith(ext))) {
      channel.sendMessage('Sound has to be in accepted format!');
      return;
    }

    const filename = attachment.filename.split('.')[0];
    if (this.getSounds().includes(filename)) {
      channel.sendMessage(`${filename} already exists!`);
      return;
    }

    https.get(attachment.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(`./sounds/${attachment.filename}`);
        response.pipe(file);
        channel.sendMessage(`${filename} added!`);
      }
    }).on('error', (error) => {
      console.error(error);
      channel.sendMessage('Something went wrong!');
    });
  }
}
module.exports = new Util();