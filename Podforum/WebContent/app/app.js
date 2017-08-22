var app = angular.module('app', ['ngStorage','ngCookies', 'bsTable', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngMaterial', 'ngFileUpload']);

app.run(['$cookies','$window',function($cookies, $window){
	if($cookies.get("activeUser") == null || $cookies.get("activeUser") == undefined){
		$window.location.href = "localhost:8080/Podforum/";
	}else{
		user = JSON.parse($cookies.get("activeUser"));
		console.log(user);
		//if(user.role == "USER"){
		$window.location.href = "http://localhost:8080/Podforum/#/user";
		//}
	}
}]);

app.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl : 'partials/home.html',
			controller: 'homeController'
		})
		.when('/login',{
			templateUrl : 'partials/loginPage.html',
			controller: 'loginController'
		})
		.when('/user',{
			templateUrl : 'partials/userPage.html',
			controller: 'userController'
		})
		.when('/registration',{
			templateUrl : 'partials/registrationPage.html',
			controller: 'registrationController'
		})
		.when('/message',{
			templateUrl : 'partials/messagePage.html',
			controller: 'messageController'
		})
});

/*app.config(function($mdThemingProvider){
	$mdThemingProvider.theme('default');
});

app.config(function($logProvider){
	$logProvider.debugEnabled(true);
});*/

