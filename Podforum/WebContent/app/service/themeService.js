app.factory('themeFactory', function($http){
	var factory = {};

	factory.addTheme = function(theme){
		return $http.post('/Podforum/rest/theme/addTheme', theme);
	}
	
	factory.getThemes = function(subforumName){
		return $http.get('/Podforum/rest/theme/getThemes/' + subforumName);
	}
	
	factory.getSavedThemes = function(username){
		return $http.get('/Podforum/rest/theme/getSavedThemes/' + username);
	}
	
	factory.deleteTheme = function(theme){
		return $http.post('/Podforum/rest/theme/deleteTheme', theme);
	}
	
	factory.editTheme = function(theme){
		return $http.post('/Podforum/rest/theme/editTheme', theme);
	}
	
	factory.saveTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/saveTheme/' + username, theme);
	}

	return factory;
});