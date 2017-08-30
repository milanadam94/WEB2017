app.controller('userController', ['$scope', '$window', '$location', '$cookies', '$route', '$filter', 'messageFactory', 'userFactory', 'subforumFactory', 'themeFactory', function($scope, $window, $location, $cookies, $route, $filter,
		messageFactory, userFactory, subforumFactory, themeFactory){

	if($cookies.get("activeUser") == null || $cookies.get("activeUser") == undefined){
		$window.location.href = "http://localhost:8080/Podforum/#/login";
	}else{
		$scope.activeUser = $cookies.getObject("activeUser");
	}
	
	$scope.inbox = [];
	$scope.users = [];
	$scope.subforums = [];
	$scope.themes = [];
	$scope.followedSubforums = [];
	$scope.showTableInbox = true;
	$scope.emptyInbox = false;
	
	$scope.message = {	"sender" : $scope.activeUser.username, "receiver" : null, "content" : null, "read" : false }
	$scope.newSub = { "name" : null, "description" : null, "rules" : null, "responibleModerator" : $scope.activeUser.username}
	$scope.subforumDetail = { "name" : null, "iconPath" : null}
	var datum = new Date();
	var noviDatum = $filter('date')(datum, "dd-MM-yyyy");
	$scope.newTheme = { "subforum" : $scope.subforumDetail.name, "name" : null, "type" : null, "author" : $scope.activeUser.username, "comments" : null, "content" : null, "creatingDate" : noviDatum, "likes" : 0, "dislikes" : 0 }
	$scope.viewInbox = false;
	$scope.newMessage = false;
	$scope.editProfile = false;
	$scope.viewSubforum = false;
	$scope.newSubforum = false;
	$scope.viewFollowedSubforums = false;
	$scope.subforumDetails = false;
	
	$scope.goToSubforum = function() {
		subforumFactory.getSubforums().success(function(data){
			$scope.subforums = data;
		});
		subforumFactory.getFollowSubforums($scope.activeUser.username).success(function(data){
			$scope.followedSubforums = data;
		});
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = false;
		$scope.viewSubforum = true;
		$scope.newSubforum = false;
		$scope.viewFollowedSubforums = false;
		$scope.subforumDetails = false;
	}
	$scope.followSub = function(subforum){
		$scope.isFollow = false;
		for(i = 0; i < $scope.followedSubforums.length; i++){
			if($scope.followedSubforums[i].name == subforum.name){
				$scope.isFollow = true;
			}
		}
		if(!$scope.isFollow){
			$scope.followedSubforums.push(subforum);
			subforumFactory.addFollowSubforum($scope.activeUser.username, subforum).success(function(data){
				toast(data);
			});
		}else{
			toast('Vec pratite ovaj forum.');
		}
	}
	$scope.details = function(subforum){
		$scope.subforumDetails = true;
		$scope.subforumDetail.name = subforum.name;
		$scope.subforumDetail.iconPath = subforum.iconPath;
		themeFactory.getThemes(subforum.name).success(function(data){
			$scope.themes = data;
		});
	}
	$scope.createNewTheme = function(){
		if(!$scope.newTheme.name){
			toast('Morate uneti naslov teme');
		}else if(!$scope.newTheme.type){
			toast('Morate izabrati tip teme');
		}else if(!$scope.newTheme.content){
			toast('Morate uneti sadrzaj teme');
		}else{
			$scope.newTheme.subforum = $scope.subforumDetail.name;
			themeFactory.addTheme($scope.newTheme).success(function(data){
				if(data == "Uspesno kreirana tema"){
					toast(data);
				}else{
					toast(data);
				}
			});
		}
	}
	$scope.cancelNewTheme = function(){
		themeFactory.getThemes($scope.subforumDetail.name).success(function(data){
			$scope.themes = data;
		});
		$scope.newTheme.name = null;
		$scope.newTheme.type = null;
		$scope.newTheme.content = null;
	}
	$scope.praceniPodforumi = function(){
		$scope.subforumDetails = false;
		$scope.viewFollowedSubforums = true;
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		subforumFactory.getFollowSubforums($scope.activeUser.username).success(function(data){
			$scope.followedSubforums = data;
		});
	}
	$scope.deleteSub = function(subforum){
		if($scope.isAdministrator()){
			subforumFactory.deleteSub(subforum).success(function(data){
				toast(data);
				for(i = 0; i < $scope.subforums.length; i++){
					if($scope.subforums[i].name == subforum.name)
						$scope.subforums.splice(i,1);
				}
			});
		}else if($scope.activeUser.username == subforum.responibleModerator){
			subforumFactory.deleteSub(subforum).success(function(data){
				toast(data);
				for(i = 0; i < $scope.subforums.length; i++){
					if($scope.subforums[i].name == subforum.name)
						$scope.subforums.splice(i,1);
				}
			});
		}else{
			toast('Ne mozete obrisati podforum.');
		}
	}
	$scope.noviForum = function() {
		$scope.subforumDetails = false;
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = true;
	}
	
	$scope.setFileEventListener = function(element) {
        $scope.uploadedFile = element.files[0];
        if ($scope.uploadedFile) {
            $scope.$apply(function() {
                $scope.upload_button_state = true;
            });   
        }
    }
	$scope.uploadFile = function() {
		uploadFile();
	};

	function uploadFile() {
		if (!$scope.uploadedFile) {
			return;
		}
		if(!$scope.newSub.name){
			toast('Morate uneti naziv podforuma');
		}else if(!$scope.newSub.description){
			toast('Morate uneti opis podforuma');
		}else if(!$scope.newSub.rules){
			toast('Morate uneti pravila podforuma');
		}else{
			subforumFactory.upload($scope.uploadedFile, $scope.newSub).success(function(data){
				if(data == "Uspesno kreiran podforum"){
					toast(data);
					$scope.newSub.name = null;
					$scope.newSub.description = null;
					$scope.newSub.rules = null;
					$scope.viewSubforum = true;
					$scope.newSubforum = false;
					$scope.goToSubforum();
					
				}else{
					toast(data);
				}
			});
		}
	}
	$scope.cancelSubforum = function() {
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = false;
		$scope.viewSubforum = true;
		$scope.newSubforum = false;
		$scope.newSub.name = null;
		$scope.newSub.description = null;
		$scope.newSub.rules = null;
	}
	$scope.editUser = function() {
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = true;
		$scope.viewSubforum = false;
		userFactory.getUsers($scope.activeUser.username).success(function(data){
			$scope.users = data;
		});
	}
	
	$scope.editRole = function(user) {
		$scope.editModal = { "username" : user.username, "name" : user.name, "role" : user.role };
	}
	
	$scope.changeRole = function(username, role){
		userFactory.editRole(username, role).success(function(data){
			toast(data);
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
		$scope.subforumDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewSubforum = false;
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
		$scope.subforumDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewSubforum = false;
		$scope.editProfile = false;
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.posaljiDugme = true;
	}
	
	$scope.send = function(){
		if(!$scope.receiver){
			toast('Morate uneti korisnicko ime primaoca');
		}else if(!$scope.content){
			toast('Morate uneti sadrzaj poruke');
		}else{
			$scope.message.receiver = $scope.receiver;
			$scope.message.content = $scope.content;
			if($scope.message.receiver == $scope.activeUser.username){
				$scope.inbox.push($scope.message);
			}
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
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
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
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewSubforum = false;
		$scope.editProfile = false;
		$scope.posaljiDugme = true;
		$scope.viewInbox = false;
		$scope.newMessage = true;
		$scope.receiver = messageInbox.sender;
		$scope.receiverDisabled = true;
		$scope.content = null;
	}
	$scope.detalji = function(messageInbox){
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewSubforum = false;
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
	$scope.user = { "username" : "", "password" : "", "name" : "", "surname" : "", "email" : "", "phoneNumber" : "", "role" : "USER", "registrationDate" : noviDatum }	
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
