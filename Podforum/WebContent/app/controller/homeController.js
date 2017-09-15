app.controller('homeController', ['$scope', '$location', '$cookies', 'subforumFactory', 'themeFactory', function($scope, $location, $cookies, subforumFactory, themeFactory){

	$scope.subforums = [];
	$scope.themes = [];
	
	$scope.subforumDetail = null;
	
	$scope.viewSubforum = true;
	$scope.subforumDetails = false;
	
	
	subforumFactory.getSubforums().success(function(data){
		$scope.subforums = data;
	});
	$scope.details = function(subforum){
		$scope.subforumDetails = true;
		$scope.subforumDetail = subforum;
		themeFactory.getThemes(subforum.name).success(function(data){
			$scope.themes = data;
		});
	}
	$scope.login = function(){
		$location.path('/login');
	}
	$scope.register = function(){
		$location.path('/registration');
	}
}]);
