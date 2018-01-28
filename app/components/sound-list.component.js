'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('soundLister').
  component('soundList', {
    template:
        '<ul>' +
          '<li ng-repeat="sound in $ctrl.sound">' +
            '<span>{{sound.name}}</span>' +
            '<p>{{sound.snippet}}</p>' +
          '</li>' +
        '</ul>',
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
    }
  });
