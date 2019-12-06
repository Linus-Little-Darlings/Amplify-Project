angular.module('home', []).component('home', {
	templateUrl: 'app/components/home/home.template.html',
	controller: function homeController($http, playerService){
		this.player = playerService;
		this.testTitle = 'blahsd;ljf;as';
		this.trackInfos = [];
    $http.get('/top-tracks').then(response => {
      this.trackInfos = response.data.items.slice(0, 5)
    })
    //this.playTrack = (id) => playerService.playTrack(id)
    $http.get('/userProfile').then(response => {
    	console.log('user info', response)
    	this.userName = response.data.display_name;
    })
	}
})