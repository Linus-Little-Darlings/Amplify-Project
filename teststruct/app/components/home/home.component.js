angular.module('home', []).component('home', {
	templateUrl: 'app/components/home/home.template.html',
	controller: function homeController($http){
		var self = this;
		this.testTitle = 'blahsd;ljf;as';
		this.trackInfos = [];
    $http.get('/top-tracks').then(response => {
      self.trackInfos = response.data.items.slice(0, 5)
    })
    this.playTrack = async (id) => {
    	console.log('id', id)
	    //$http.put('/play-track', {id: id})
	    var token = await $http.get('/getSpotifyAuthToken');
	    var options = {
	    	headers: { 'Authorization': 'Bearer ' + token.data},
	    }
	    $http.put('https://api.spotify.com/v1/me/player/play', {uris: ['spotify:track:'+id]}, options)
	  }
	}
})