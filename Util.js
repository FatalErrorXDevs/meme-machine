const fs = require('fs');
const https = require('https');
const config = require('config');

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


  getSoundsWithExtension() {
    const files = fs.readdirSync('sounds/');
    let sounds = files.filter(sound => config.get('extensions').some(ext => sound.endsWith(ext)));
    sounds = sounds.map(sound => ({ name: sound.split('.')[0], extension: sound.split('.')[1] }));
    return sounds;
  }

  getSounds() {
    const sounds = this.getSoundsWithExtension();
    return sounds.map(sound => sound.name);
  }

 _addSound(attachment, channel) {
    if (attachment.filesize > config.get('size')) {
      channel.send(`${attachment.filename.split('.')[0]} is too big!`);
      return;
    }

    if (!config.get('extensions').some(ext => attachment.filename.endsWith(ext))) {
      channel.send('Sound has to be in accepted format!');
      return;
    }   

    const filename = attachment.filename.split('.')[0];
    if (this.getSounds().includes(filename)) {
      channel.send(`${filename} already exists!`);
      return;
    }

    https.get(attachment.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(`./sounds/${attachment.filename}`);
        response.pipe(file);
        channel.send(`${filename} added!`);
      }
    }).on('error', (error) => {
      console.error(error);
      channel.send('Something went wrong!');
    });
  }
}
module.exports = new Util();