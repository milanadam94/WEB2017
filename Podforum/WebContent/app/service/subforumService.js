app.factory('subforumFactory', function($http){
	var factory = {};
	
	factory.upload = function(uploadedFile, subforum) {
		var fd = new FormData();
        fd.append("file", uploadedFile);
        fd.append("name", subforum.name);
        fd.append("description", subforum.description);
        fd.append("rules", subforum.rules);
        fd.append("responibleModerator", subforum.responibleModerator);
        return $http.post('/Podforum/rest/subforum/addSubforum', fd, {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: angular.identity
       });
    }
	
	factory.getSubforums = function(){
		return $http.get('/Podforum/rest/subforum/getSubforums');
	}
	
	factory.deleteSub = function(subforum){
		return $http.post('/Podforum/rest/subforum/deleteSubforum', subforum);
	}
	
	factory.addFollowSubforum = function(username, subforum){
		return $http.post('/Podforum/rest/subforum/addFollowSubforum/' + username, subforum);
	}
	
	factory.getFollowSubforums = function(username){
		return $http.get('/Podforum/rest/subforum/getFollowSubforums/' + username);
	}
	
	return factory;
});