app.controller('homeController', ['$scope', '$location', '$cookies', 'subforumFactory', 'themeFactory', 'commentFactory', function($scope, $location, $cookies, subforumFactory, themeFactory, commentFactory){

	$scope.subforums = [];
	$scope.themes = [];
	$scope.comments = [];
	
	$scope.subforumDetail = null;
	$scope.themeDetail = null;
	
	$scope.viewSubforum = true;
	$scope.subforumDetails = false;
	
	$scope.searchSub = { "description" : null, "name" : null, "responsibleModerator" : null }
	$scope.searchTheme = { "tag" : null, "content" : null, "author" : null }
	
	$scope.searchThemes = [];
	$scope.searchSubforums = [];
	
	subforumFactory.getSubforums().success(function(data){
		$scope.subforums = data;
		$scope.searchSubforums = data;
	});
	$scope.details = function(subforum){
		$scope.subforumDetails = true;
		$scope.themeDetails = false;
		$scope.subforumDetail = subforum;
		themeFactory.getThemes(subforum.name).success(function(data){
			$scope.themes = data;
			$scope.searchThemes = data;
		});
	}
	$scope.openTheme = function(theme){
		$scope.themeDetails = true;
		$scope.themeDetail = theme;
		commentFactory.getComments(theme.name).success(function(data){
			$scope.comments = data;
		});
	}
	$scope.searchSubforum = function(){
		if(!$scope.searchSub.name)
			$scope.searchSub.name = null;
		if(!$scope.searchSub.description)
			$scope.searchSub.description = null;
		if(!$scope.searchSub.responsibleModerator)
			$scope.searchSub.responsibleModerator = null;
		
		subforumFactory.search($scope.searchSub.name, $scope.searchSub.description, $scope.searchSub.responsibleModerator).success(function(data){
			if(($scope.searchSub.name == null) && ($scope.searchSub.description == null) && ($scope.searchSub.responsibleModerator == null)){
				$scope.subforums = $scope.searchSubforums;
			}else{
				$scope.subforums = data;
			}
		});
	}
	$scope.searchTheme = function(){
		if(!$scope.searchTheme.tag)
			$scope.searchTheme.tag = null;
		if(!$scope.searchTheme.content)
			$scope.searchTheme.content = null;
		if(!$scope.searchTheme.author)
			$scope.searchTheme.author = null;
		
		themeFactory.search($scope.searchTheme.tag, $scope.searchTheme.content, $scope.searchTheme.author).success(function(data){
			if(($scope.searchTheme.tag == null) && ($scope.searchTheme.content == null) && ($scope.searchTheme.author == null)){
				$scope.themes = $scope.searchThemes;
			}else{
				$scope.themes = data;
			}
		});
	}
	$scope.login = function(){
		$location.path('/login');
	}
	$scope.register = function(){
		$location.path('/registration');
	}
}]);
