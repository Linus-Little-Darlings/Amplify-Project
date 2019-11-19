angular.module('home', ['ngRoute']).component('home', {
	templateUrl: 'app/components/home/home.template.html',
	controller: function homeController(){
		this.test = [{text:'home test'}]
	}
})