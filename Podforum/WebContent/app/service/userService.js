app.factory('userFactory', function($http){
	var factory = {};
	
	factory.getUser = function(user) {
		return $http.get('/Podforum/rest/user/getUser/'+user.username+'/'+user.password);
	};
	
	factory.addUser = function(user){
		return $http.post('/Podforum/rest/user/addUser', {	"username":user.username, "password":user.password,
		     												"name":user.name, "surname":user.surname,
		     												"email":user.email, "phoneNumber":user.phoneNumber,
		     												"role":user.role, "registrationDate":user.registrationDate});
	}
	
	factory.getUsers = function(username) {
		return $http.get('/Podforum/rest/user/getUsers/'+username);
	}
	
	factory.editRole = function(username, role) {
		return $http.post('/Podforum/rest/user/changeRole/' + username + '/' + role);
	}
	
	return factory;
});