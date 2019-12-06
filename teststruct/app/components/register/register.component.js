angular.module('register', []).component('register', {
	templateUrl: 'app/components/register/register.template.html',
	controller: function registerController($http, $rootScope, $state){
		this.email = '';
		this.password = '';
		this.passwordConf = '';
		this.registerUser = function(){
			console.log('register', this.email)
			$http.post('/registerUser', {email:this.email,password:this.password,passwordConf: this.passwordConf}).then(response => {
				$rootScope.currentUser = response.data;
				$state.go('home')
			})
		}
	}
})