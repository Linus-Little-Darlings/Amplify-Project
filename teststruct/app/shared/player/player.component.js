angular.module('player',[]).component('player', {
  templateUrl: 'app/shared/player/player.template.html',
  controller: function playerController($http, playerService){
    this.player = playerService;
  }
})
