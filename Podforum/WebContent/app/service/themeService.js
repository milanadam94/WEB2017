app.factory('themeFactory', function($http){
	var factory = {};

	factory.addTheme = function(theme){
		return $http.post('/Podforum/rest/theme/addTheme', theme);
	}
	
	factory.getThemes = function(subforumName){
		return $http.get('/Podforum/rest/theme/getThemes/' + subforumName);
	}
	
	factory.getThemesOfFollowedSubforums = function(username){
		return $http.get('/Podforum/rest/theme/getThemesOfFollowedSubforums/' + username);
	}
	
	factory.getSavedThemes = function(username){
		return $http.get('/Podforum/rest/theme/getSavedThemes/' + username);
	}
	
	factory.removeSavedTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/removeSavedTheme/' + username, theme);
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
	
	factory.likeTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/likeTheme/' + username, theme);
	}

	factory.dislikeTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/dislikeTheme/' + username, theme);
	}
	
	factory.getLikedThemes = function(username){
		return $http.get('/Podforum/rest/theme/getLikedThemes/' + username);
	}
	
	factory.getDislikedThemes = function(username){
		return $http.get('/Podforum/rest/theme/getDislikedThemes/' + username);
	}
	
	factory.dislikeLikedTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/dislikeLikedTheme/' + username, theme);
	}
	
	factory.likeDislikedTheme = function(username, theme){
		return $http.post('/Podforum/rest/theme/likeDislikedTheme/' + username, theme);
	}
	
	factory.search = function(name, content, author){
		return $http.get('/Podforum/rest/theme/search/' + name + '/' + content + '/' + author);
	}
	
	return factory;
});