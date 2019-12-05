angular.module('connectModal', []).component('connectModal', {
	templateUrl: 'app/components/connectSpotify/connect-modal.template.html',
	controller: function connectModalController($scope, $state){
		$scope.close = function(){
			$state.go('home')
		}
	},
})