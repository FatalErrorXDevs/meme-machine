'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('soundLister').
  component('soundList', {
    templateUrl: 'soundLister.html',
    controller: function SoundListController($scope) {

      this.test = function(name) {
        console.log("reeee" + " "  + name);
            this.socket.emit('play', name);
        };

      this.socket = io.connect();
      this.socket.emit('getChannels');

      this.socket.on('loadDisplay', function(soundList){
        $scope.sounds = {text : soundList};
        $scope.$apply(function(){
          $scope.sounds = {text : soundList};
        });
        console.log($scope.sounds.text);
      });

      this.socket.on('loadChannels', function(channels){
        $scope.channels = channels;
        console.log($scope.channels);
      });

    }
  });
