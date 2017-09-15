app.factory('commentFactory', function($http){
	var factory = {};

	factory.addComment = function(comment){
		return $http.post('/Podforum/rest/comment/addComment', comment);
	}
	
	factory.getComments = function(themeName){
		return $http.get('/Podforum/rest/comment/getComments/' + themeName);
	}

	return factory;
});