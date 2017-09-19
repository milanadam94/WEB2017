app.controller('homeController', ['$scope', '$location', '$cookies', 'subforumFactory', 'themeFactory', 'commentFactory', function($scope, $location, $cookies, subforumFactory, themeFactory, commentFactory){

	$scope.subforums = [];
	$scope.themes = [];
	$scope.comments = [];
	
	$scope.subforumDetail = null;
	$scope.themeDetail = null;
	
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
	$scope.openTheme = function(theme){
		$scope.themeDetails = true;
		$scope.themeDetail = theme;
		commentFactory.getComments(theme.name).success(function(data){
			$scope.comments = data;
		});
	}
	$scope.login = function(){
		$location.path('/login');
	}
	$scope.register = function(){
		$location.path('/registration');
	}
}]);
