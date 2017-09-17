app.factory('commentFactory', function($http){
	var factory = {};

	factory.addComment = function(comment){
		return $http.post('/Podforum/rest/comment/addComment', comment);
	}
	
	factory.addSubcomment = function(comment){
		return $http.post('/Podforum/rest/comment/addSubcomment', comment);
	}
	
	factory.getComments = function(themeName){
		return $http.get('/Podforum/rest/comment/getComments/' + themeName);
	}
	
	factory.editComment = function(comment, oldCom){
		return $http.post('/Podforum/rest/comment/editComment/' + oldCom, comment);
	}
	
	return factory;
});