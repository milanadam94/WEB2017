app.factory('messageFactory', function($http){
	var factory = {};
	
	factory.send = function(message) {
		return $http.post('/Podforum/rest/message/send', {  "sender" : message.sender, "receiver" : message.receiver,
													"content" : message.content, "read" : message.read });
	}
	
	factory.inbox = function(username) {
		return $http.get('/Podforum/rest/message/inbox/' + username);
	}
	
	factory.read = function(message) {
		return $http.post('/Podforum/rest/message/read', {  "sender" : message.sender, "receiver" : message.receiver,
															"content" : message.content, "read" : message.read });
	}
	return factory;
});