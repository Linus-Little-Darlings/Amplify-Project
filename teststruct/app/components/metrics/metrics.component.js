angular.module('metrics', ['ngRoute']).component('metrics', {
	templateUrl: 'app/components/metrics/metrics.template.html',
	controller: function metricsController($http){
		this.test = 'this is a test';
		
		$http.get('/top-tracks').then(response => {
			console.log('got tracks', response.data.items)
			this.topTracks = response.data.items.slice(0,10);
		})
		$http.get('/top-artists').then(response => {
			this.topArtists = response.data.items.slice(0,10);
		})
	}
})