angular.module('amplifyApp')
.run(function ($transitions, $rootScope, $state) {
	$transitions.onStart({}, function(trans){
	  var requireLogin = trans.to().data.requireLogin;
	  if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
		 	return trans.router.stateService.target('login');
		}
	})
 
});