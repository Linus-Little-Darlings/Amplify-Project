angular.module('amplifyApp')
.config(['$stateProvider', function($stateProvider){
	/*$routeProvider
		.when('/home', {
			template: '<amp-header/><home/>'
		})
		.when('/metrics', {
			template: '<amp-header/><metrics/>'
		})
		.when('/login', {
			template: '<amp-header/><login/>'
		})
		.when('/register', {
			template: '<amp-header/><register/>'
		})
		.when('/connectSpotify', {
			template: '<amp-header/><refresh-token/>'
		})
		.otherwise('/home')*/
	var homeState = {
		name: 'home',
		url: '/home',
		template: '<home/>',
		data: {
			requireLogin: true
		}
	}
	var metricsState = {
		name: 'metrics',
		url: '/metrics',
		template: '<metrics/>',
		data: {
			requireLogin: true
		}
	}
	var loginState = {
		name: 'login',
		url: '/login',
		template: '<login/>',
		data: {
			requireLogin: false
		}
	}
	var registerState = {
		name: 'register',
		url: '/register',
		template: '<register/>',
		data: {
			requireLogin: false
		}
	}
	$stateProvider.state(homeState)
	$stateProvider.state(metricsState)
	$stateProvider.state(loginState)
	$stateProvider.state(registerState)
	$stateProvider.state('baseModal', {
		views:{
			'modal': {
				template: '<base-modal/>'
			}
		},
		abstract: true,
		data: {
			requireLogin: true
		}
	})
	$stateProvider.state('baseModal.connect', {
		views:{
			'modal-content':{
				template: '<connect-modal/>'
		}
		}
	})
}])