'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('soundLister').
  component('soundList', {
    templateUrl: 'soundLister.html',
    controller: function SoundListController($scope, $interval) {

      this.test = function(name) {
        console.log("reeee" + " "  + name);
            this.socket.emit('play', name);
        };

      this.socket = io.connect();

      $scope.socket = this.socket;
      $scope.socket.emit('getChannels');
      $scope.socket.emit('getSounds');


      $interval(function(){
        $scope.socket.emit('getChannels');
        $scope.socket.emit('getSounds');
      },60000);


      this.socket.on('loadDisplay', function(soundList){
        $scope.sounds = {text : soundList};
        $scope.$apply(function(){
          $scope.sounds = {text : soundList};
        });
        console.log($scope.sounds.text);
      });

      this.socket.on('loadChannels', function(channels){
        $scope.channels = channels;
        $scope.$apply(function(){
          $scope.channels = channels;
        });
        console.log($scope.channels);
      });


      $scope.getLimitedWord = function(word, size){
        if(word.length <= size){
          return word;
        } else {
          return word.substr(0,size) + '...';
        }}


    }
  });
