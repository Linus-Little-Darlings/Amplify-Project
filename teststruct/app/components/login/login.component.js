angular.module('login', ['ngRoute']).component('login', {
	templateUrl: 'app/components/login/login.template.html',
	controller: function homeController(){
		this.test = [{text:'home test'}]
	}
})