angular.module('ampHeader', []).component('ampHeader', {
	templateUrl: 'app/shared/header/amp-header.template.html',
	controller: function ampHeaderController(){
		this.test = [{text:'test'}]
	}
})