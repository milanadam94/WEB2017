app.factory('themeFactory', function($http){
	var factory = {};

	factory.addTheme = function(theme){
		return $http.post('/Podforum/rest/theme/addTheme', theme);
	}
	
	factory.getThemes = function(subforumName){
		return $http.get('/Podforum/rest/theme/getThemes/' + subforumName);
	}
	
	return factory;
});