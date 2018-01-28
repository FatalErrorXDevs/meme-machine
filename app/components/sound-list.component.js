'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('soundLister').
  component('soundList', {
    templateUrl: 'soundLister.html',
    controller: function SoundListController() {
      this.sound = [
        {
          name: 'Nexus S',
          snippet: 'Fast just got faster with Nexus S.'
        }, {
          name: 'Motorola XOOM™ with Wi-Fi',
          snippet: 'The Next, Next Generation tablet.'
        }, {
          name: 'MOTOROLA XOOM™',
          snippet: 'The Next, Next Generation tablet.'
        }
      ];
      this.socket = io.connect();
      this.test = function(name) {
      console.log("reeee" + " "  + name);
          this.socket.emit('play', name);
      }
    }
  });
