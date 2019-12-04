angular.module('register', []).component('register', {
	templateUrl: 'app/components/register/register.template.html',
	controller: function registerController(){
		this.test = [{text:'register test'}]
	}
})