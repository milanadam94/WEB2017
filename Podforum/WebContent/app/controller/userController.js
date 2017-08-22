app.controller('userController', ['$scope', '$window', '$location', '$cookies', 'messageFactory', function($scope, $window, $location, $cookies, messageFactory){

	//$scope.activeUser = $cookies.getObject("activeUser");
	//console.log($scope.activeUser);
	if($cookies.get("activeUser") == null || $cookies.get("activeUser") == undefined){
		$window.location.href = "http://localhost:8080/Podforum/#/login";
	}else{
		$scope.activeUser = $cookies.getObject("activeUser");
		//console.log($scope.activeUser);
	}
	$scope.inbox = [];
	$scope.sent = [];
	$scope.showTableInbox = true;
	$scope.emptyInbox = false;
	
	messageFactory.inbox($scope.activeUser.username).success(function(data){
		$scope.inbox = data;
		console.log($scope.inbox)
		if($scope.inbox.length == 0){
			$scope.showTableInbox = false;
			$scope.emptyInbox = "Nema primljenih poruka."
		}
	});
	
	$scope.message = {
			"sender" : $scope.activeUser.username,
			"receiver" : "",
			"content" : "",
			"read" : false
	}
	
	$scope.viewInbox = false;
	$scope.newMessage = false;
	
	$scope.logout = function() {
		$cookies.remove("activeUser");
		$location.path('/login');
	} 	 
	
	$scope.goToInbox = function() {
		$scope.viewInbox = true;
		$scope.newMessage = false;
	}

	$scope.novaPoruka = function() {
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
		$scope.viewInbox = true;
		$scope.newMessage = false;
		$scope.receiver = null;
		$scope.content = null;
		$scope.receiverDisabled = false;
		$scope.contentDisabled = false;
		$scope.posaljiDugme = true;
	}
	$scope.odgovori = function(messageInbox){
		$scope.posaljiDugme = true;
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.receiver = messageInbox.sender;
		$scope.receiverDisabled = true;
		$scope.content = null;
	}
	$scope.detalji = function(messageInbox){
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
					if(logged.role == 'USER'){
						$location.path('/user');
					}/*else if(logged.role == 'ADMINISTRATOR'){
						$location.path('/admin');
					}else{
						$location.path('/manager');
					}*/
					
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
