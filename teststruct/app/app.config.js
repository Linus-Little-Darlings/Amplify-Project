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
		template: '<home/>'
	}
	var metricsState = {
		name: 'metrics',
		url: '/metrics',
		template: '<metrics/>'
	}
	var loginState = {
		name: 'login',
		url: '/login',
		template: '<login/>'
	}
	var registerState = {
		name: 'register',
		url: '/register',
		template: '<register/>'
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
		abstract: true
	})
	$stateProvider.state('baseModal.connect', {
		views:{
			'modal-content':{
				template: '<connect-modal/>'
		}
		}
	})
}])