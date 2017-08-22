app.controller('userController', ['$scope', '$window', '$location', '$cookies', 'messageFactory', 'userFactory', function($scope, $window, $location, $cookies, messageFactory, userFactory){

	if($cookies.get("activeUser") == null || $cookies.get("activeUser") == undefined){
		$window.location.href = "http://localhost:8080/Podforum/#/login";
	}else{
		$scope.activeUser = $cookies.getObject("activeUser");
	}
	
	$scope.inbox = [];
	$scope.users = [];
	$scope.showTableInbox = true;
	$scope.emptyInbox = false;
	
	$scope.message = {	"sender" : $scope.activeUser.username, "receiver" : "", "content" : "", "read" : false }
	$scope.viewInbox = false;
	$scope.newMessage = false;
	$scope.editProfile = false;
	
	$scope.editUser = function() {
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = true;
		userFactory.getUsers($scope.activeUser.username).success(function(data){
			$scope.users = data;
		});
	}
	
	$scope.editRole = function(user) {
		$scope.editModal = { "username" : user.username, "name" : user.name, "role" : user.role };
	}
	
	$scope.changeRole = function(username, role){
		userFactory.editRole(username, role).success(function(data){
			
		});
		for(i = 0; i < $scope.users.length; i++){
			if($scope.users[i].username == username)
				$scope.users[i].role = role;
		}
	}
	$scope.isRoleUser = function(role){
		if(role == "USER")
			return true;
		else 
			return false
	}
	$scope.isRoleAdmin = function(role){
		if(role == "ADMINISTRATOR")
			return true;
		else 
			return false
	}
	$scope.isRoleModerator = function(role){
		if(role == "MODERATOR")
			return true;
		else 
			return false
	}
	$scope.logout = function() {
		$cookies.remove("activeUser");
		$location.path('/login');
	} 	 
	
	$scope.goToInbox = function() {
		$scope.editProfile = false;
		$scope.viewInbox = true;
		$scope.newMessage = false;
		messageFactory.inbox($scope.activeUser.username).success(function(data){
			$scope.inbox = data;
			if($scope.inbox.length == 0){
				$scope.showTableInbox = false;
				$scope.emptyInbox = "Nema primljenih poruka."
			}
		});
	}

	$scope.novaPoruka = function() {
		$scope.editProfile = false;
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.posaljiDugme = true;
	}
	
	$scope.send = function(){
		if($scope.receiver == null){
			toast('Morate uneti korisnicko ime primaoca');
		}else if($scope.content == null){
			toast('Morate uneti sadrzaj poruke');
		}else{
			$scope.message.receiver = $scope.receiver;
			$scope.message.content = $scope.content;
			messageFactory.send($scope.message).success(function(data){
				if(data == "Poruka poslata"){
					toast(data);
					$scope.viewInbox = true;
					$scope.newMessage = false;
					$scope.receiver = null;
					$scope.content = null;
				}else{
					toast(data);
				}		
			});
		}
	}
	$scope.cancel = function() {
		$scope.editProfile = false;
		$scope.viewInbox = true;
		$scope.newMessage = false;
		$scope.receiver = null;
		$scope.content = null;
		$scope.receiverDisabled = false;
		$scope.contentDisabled = false;
		$scope.posaljiDugme = true;
	}
	$scope.odgovori = function(messageInbox){
		$scope.editProfile = false;
		$scope.posaljiDugme = true;
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.receiver = messageInbox.sender;
		$scope.receiverDisabled = true;
		$scope.content = null;
	}
	$scope.detalji = function(messageInbox){
		$scope.editProfile = false;
		messageInbox.read = true;
		messageFactory.read(messageInbox);
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.receiver = messageInbox.sender;
		$scope.receiverDisabled = true;
		$scope.content = messageInbox.content;
		$scope.contentDisabled = true;
		$scope.posaljiDugme = false;
	}
	$scope.isAdministrator = function() {
		if($scope.activeUser.role == "ADMINISTRATOR")
			return true;
		else
			return false;
	}
	$scope.isModerator = function() {
		if($scope.activeUser.role == "MODERATOR")
			return true;
		else
			return false;
	}
	$scope.isUser = function() {
		if($scope.activeUser.role == "USER")
			return true;
		else
			return false;
	}
}]);


app.controller('loginController', [ '$scope', '$location', '$cookies', '$localStorage', 'loginService', 'registrationService', 'userFactory',  function($scope, $location, $cookies, $localStorage, loginService, registrationService, userFactory){
	$scope.errorMessage = false;	
	$scope.user = {
			"username" : "",
			"password" : ""
	}
	$scope.login = function(){		
		var retVal = loginService.validateLoginInput($scope.user);
		if(retVal) {
			$scope.errorMessage = retVal;
		}
		else {
			userFactory.getUser($scope.user).success(function(data){
				if(data){
					var logged = data;
					$cookies.putObject("activeUser", logged);
					$localStorage.loggedUser = logged.username;
					$location.path('/user');
				}else{
					toast('Pogresno korisnicko ime ili lozinka');
				}
			});
		}
	}
	$scope.register = function(){
		$location.path('/registration');
	}	 
}]);

app.controller('registrationController', [ '$scope', '$filter', '$location', 'registrationService', 'userFactory',  function($scope, $filter, $location, registrationService, userFactory){	
	$scope.errorMessage = false;
	var datum = new Date();
	var noviDatum = $filter('date')(datum, "dd-MM-yyyy");
	$scope.user = {
			"username" : "",
			"password" : "",
			"name" : "",
			"surname" : "",
			"email" : "",
			"phoneNumber" : "",
			"role" : "USER",
			"registrationDate" : noviDatum
	}	
	$scope.passwordConfirm = "";
	
	$scope.register = function(){		
		retVal = registrationService.validateRegistrationInput($scope.user, $scope.passwordConfirm)	
		if(retVal) {
			$scope.errorMessage = retVal;
		}
		else {
			userFactory.addUser($scope.user).success(function(data){
				if(data == "Korisnik uspesno registrovan"){
					toast(data);
					$location.path('/login');
				}else{
					toast(data);
				}		
			});
		}
	}		 
}]);

app.service('loginService', ['$http', '$window', function($http, $window){
	this.validateLoginInput = function(user){
		if(user.email == "" || user.password == "")
			return "Potrebno je uneti e-mail i lozinku."
		
		return false;
	}	 
}]);

app.service('registrationService', ['$http', '$window', '$timeout', function($http, $window, $timeout){
	this.validateRegistrationInput = function(user, passwordConfirm){
		if(user.username == "" || user.password == "" || user.name == "" || user.surname == "" || passwordConfirm == ""
			|| user.email == "" || user.phoneNumber == "")
			return "Sva polja se moraju uneti."
		if(user.password != passwordConfirm)
			return "Lozinke se ne podudaraju.";
	
		return false;
	}	
}]);
