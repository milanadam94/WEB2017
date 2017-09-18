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
	
	factory.getSavedComments = function(username){
		return $http.get('/Podforum/rest/comment/getSavedComments/' + username);
	}
	
	factory.editComment = function(comment, oldCom){
		return $http.post('/Podforum/rest/comment/editComment/' + oldCom, comment);
	}
	
	factory.deleteComment = function(comment){
		return $http.post('/Podforum/rest/comment/deleteComment', comment);
	}
	
	factory.saveComment = function(username, comment){
		return $http.post('/Podforum/rest/comment/saveComment/' + username, comment)
	}
	
	factory.likeComment = function(username, comment){
		return $http.post('/Podforum/rest/comment/likeComment/' + username, comment);
	}
	
	factory.dislikeComment = function(username, comment){
		return $http.post('/Podforum/rest/comment/dislikeComment/' + username, comment);
	}
	
	return factory;
});