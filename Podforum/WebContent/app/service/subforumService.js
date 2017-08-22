app.factory('subforumFactory', function($http){
	var factory = {};
	
	factory.upload = function(uploadedFile, subforumName) {
		var fd = new FormData();
        fd.append("file", uploadedFile);
        return $http.post('/Podforum/rest/subforum/uploadIcon/' + subforumName, fd, {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: angular.identity
       });
    }
	
	factory.saveSubforum = function(subforum) {
		console.log(subforum)
		return $http.post('/Podforum/rest/subforum/saveSubforum', subforum);
	}
	return factory;
});