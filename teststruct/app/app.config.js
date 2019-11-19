angular.module('amplifyApp')
.config(['$routeProvider', function config($routeProvider){
	$routeProvider
		.when('/home', {
			template: '<amp-header></amp-header><home></home>'
		})
		.when('/metrics', {
			template: '<amp-header></amp-header><metrics></metrics>'
		})
		.when('/login', {
			template: '<amp-header></amp-header><login></login>'
		})
		.otherwise('/home')
}])