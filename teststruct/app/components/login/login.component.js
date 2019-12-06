angular.module('login', []).component('login', {
	templateUrl: 'app/components/login/login.template.html',
	controller: function loginController($http, $rootScope, $state){
		this.email = '';
		this.password = '';
		this.submitLogin = function(){
			console.log(this.email)
			console.log(this.password)
			$http.post('/loginUser', {email: this.email, password: this.password}).then(response => {
				$rootScope.currentUser = response.data;
				$state.go('home')
			})
		}
	}
})