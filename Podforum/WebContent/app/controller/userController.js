app.controller('userController', ['$scope', '$window', '$location', '$cookies', '$route', '$filter', 'messageFactory', 'userFactory', 
           'subforumFactory', 'themeFactory', 'commentFactory', function($scope, $window, $location, $cookies, $route, $filter,
           messageFactory, userFactory, subforumFactory, themeFactory, commentFactory){

	if($cookies.get("activeUser") == null || $cookies.get("activeUser") == undefined){
		$window.location.href = "http://localhost:8080/Podforum/#/";
	}else{
		$scope.activeUser = $cookies.getObject("activeUser");
	}
	goToHome();
	
	$scope.inbox = [];
	$scope.users = [];
	$scope.usersSearch = [];
	$scope.subforums = [];
	$scope.followedSubforums = [];
	$scope.themesOfFollowedSubforums = [];
	$scope.themes = [];
	$scope.searchThemes = [];
	$scope.savedThemes = [];
	$scope.likedThemes = [];
	$scope.dislikedThemes = [];
	$scope.comments = [];
	$scope.savedComments = [];
	$scope.likedComments = [];
	$scope.dislikedComments = [];
	$scope.showTableInbox = true;
	
	$scope.searchSubforums = [];
	$scope.searchSub = { "description" : null, "name" : null, "responsibleModerator" : null }
	$scope.searchTheme = { "tag" : null, "content" : null, "author" : null }
	$scope.message = {	"sender" : $scope.activeUser.username, "receiver" : null, "content" : null, "read" : false }
	$scope.newSub = { "name" : null, "description" : null, "rules" : null, "responibleModerator" : $scope.activeUser.username}
	$scope.subforumDetail = null;
	$scope.themeDetail = null;
	var datum = new Date();
	var noviDatum = $filter('date')(datum, "dd-MM-yyyy HH:mm");
	$scope.newTheme = { "subforum" : $scope.subforumDetail, "name" : null, "type" : null, "author" : $scope.activeUser.username, 
			"comments" : [], "content" : null, "creatingDate" : noviDatum, "likes" : 0, "dislikes" : 0 , "usersLiked" : [], "usersDisliked" : []}
	$scope.newComment = { "theme" : $scope.themeDetail, "author" : $scope.activeUser.username, "creatingDate" : noviDatum, "parent" : null,
			"children" : [], "text" : null, "likes" : 0, "dislikes" : 0, "changed" : false, "deleted" : false, "usersLiked" : [], "usersDisliked" : []}
	$scope.newSubcomment = { "theme" : $scope.themeDetail, "author" : $scope.activeUser.username, "creatingDate" : noviDatum, "parent" : null,
			"children" : [], "text" : null, "likes" : 0, "dislikes" : 0, "changed" : false, "deleted" : false, "usersLiked" : [], "usersDisliked" : []}
	
	$scope.viewInbox = false;
	$scope.newMessage = false;
	$scope.editProfile = false;
	$scope.viewSubforum = false;
	$scope.newSubforum = false;
	$scope.viewFollowedSubforums = false;
	$scope.subforumDetails = false;
	$scope.themeDetails = false;
	
	$scope.goToSubforum = function() {
		subforumFactory.getSubforums().success(function(data){
			$scope.subforums = data;
			$scope.searchSubforums = data;
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
		$scope.themeDetails = false;
		$scope.viewLikeDislike = false;
		$scope.viewSaveEnt = false;
		$scope.viewHome = false;
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
	$scope.unfollow = function(subforum){
		subforumFactory.unfollowSubforum($scope.activeUser.username, subforum).success(function(data){
			for(i = 0; i < $scope.followedSubforums.length; i++){
				if($scope.followedSubforums[i].name == subforum.name)
					$scope.followedSubforums.splice(i,1);
			}
			if($scope.followedSubforums.length == 0){
				$scope.followSubforumsMessage = "Ne pratite nijedan podforum."
				$scope.followedSubforumsView = false;
			}
			toast(data);
			$scope.subforumDetails = false;
			$scope.themeDetails = false;
		});
	}
	$scope.details = function(subforum){
		$scope.subforumDetails = true;
		$scope.subforumDetail = subforum;
		themeFactory.getThemes(subforum.name).success(function(data){
			$scope.themes = data;
			$scope.searchThemes = data;
		});
		themeFactory.getSavedThemes($scope.activeUser.username).success(function(data){
			$scope.savedThemes = data;
		});
		$scope.themeDetails = false;
	}
	$scope.openTheme = function(theme){
		$scope.themeDetails = true;
		$scope.themeDetail = theme;
		commentFactory.getComments(theme.name).success(function(data){
			$scope.comments = data;
		});
		commentFactory.getSavedComments($scope.activeUser.username).success(function(data){
			$scope.savedComments = data;
		});
	}
	$scope.createNewComment = function(){
		if(!$scope.newCommentText){
			toast('Morate uneti tekst komentara');
		}else{
			$scope.newComment.theme = $scope.themeDetail;
			$scope.newComment.text = $scope.newCommentText;
			commentFactory.addComment($scope.newComment).success(function(data){
				if(data == "Prokomentarisana tema"){
					toast(data);
					$scope.comments.push($scope.newComment);
					/*for(i = 0; i < $scope.themes.length; i++){
						if(angular.equals($scope.themes[i], $scope.newComment.theme)){
							$scope.themes[i].comments = $scope.themes[i].comments.concat($scope.newComment);
							//Array.prototype.push.apply($scope.themes[i].comments, $scope.newComment);
						}
					}*/
					$scope.newCommentText = null;
					$scope.newComment.children = [];
					$scope.newComment.theme = null;
					//$scope.newComment.text = null;
				}
			});
			$scope.openTheme($scope.themeDetail);
		}
	}
	$scope.subcomment = {};
	$scope.createNewSubcomment = function(comment){
		if(comment.deleted){
			toast('Ne mozete odgovoriti na obrisan komentar');
			return;
		}
		if(!$scope.subcomment.com){
			toast('Morate uneti tekst podkomentara');
		}else{
			$scope.newSubcomment.theme = $scope.themeDetail;
			$scope.newSubcomment.text = $scope.subcomment.com;
			for( i = 0; i < $scope.comments.length; i++){
				if($scope.comments[i].text == comment.text){
					if($scope.comments[i].children == null)
						$scope.comments[i].children = [];
					$scope.comments[i].children.push($scope.newSubcomment);
					commentFactory.addSubcomment($scope.comments[i]).success(function(data){
						toast(data);
					});
					$scope.subcomment.com = null;
				}
			}
		}
	}
	$scope.editComment = function(comment){
		var date = new Date();
		var newDate = $filter('date')(date, "dd-MM-yyyy HH:mm");
		$scope.editCommentModal = { "theme" : comment.theme, "author" : comment.author, "creatingDate" : newDate, "parent" : comment.parent,
				"children" : comment.children, "text" : comment.text, "likes" : comment.likes, "dislikes" : comment.dislikes, "changed" : comment.changed, "deleted" : comment.deleted}
		$scope.oldCom = comment.text;
	}
	$scope.cancelEditComment = function(){
		$scope.editCommentModal = null;
	}
	$scope.saveEditComment = function(){
		if($scope.editCommentModal.deleted){
			toast('Ne mozete izmeniti obrisan komentar');
			return;
		}
		if($scope.activeUser.username == $scope.editCommentModal.theme.subforum.responibleModerator){
			console.log("odgovorni");
			commentFactory.editComment($scope.editCommentModal, $scope.oldCom).success(function(data){
				toast(data);
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == $scope.oldCom){
						$scope.comments[i].text = $scope.editCommentModal.text;
						$scope.comments[i].creatingDate = $scope.editCommentModal.creatingDate;
						$scope.comments[i].changed = $scope.editCommentModal.changed;
					}
					for(j = 0; j < $scope.comments[i].children.length; j++){
						if($scope.comments[i].children[j].text == $scope.oldCom){
							$scope.comments[i].children[j].text = $scope.editCommentModal.text;
							$scope.comments[i].children[j].creatingDate = $scope.editCommentModal.creatingDate;
							$scope.comments[i].children[j].changed = $scope.editCommentModal.changed;
						}
					}
				}
			});
		}else if($scope.activeUser.username == $scope.editCommentModal.author){
			console.log("autor");
			$scope.editCommentModal.changed = true;
			commentFactory.editComment($scope.editCommentModal, $scope.oldCom).success(function(data){
				toast(data);
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == $scope.oldCom){
						$scope.comments[i].text = $scope.editCommentModal.text;
						$scope.comments[i].creatingDate = $scope.editCommentModal.creatingDate;
						$scope.comments[i].changed = $scope.editCommentModal.changed;
					}
					for(j = 0; j < $scope.comments[i].children.length; j++){
						if($scope.comments[i].children[j].text == $scope.oldCom){
							$scope.comments[i].children[j].text = $scope.editCommentModal.text;
							$scope.comments[i].children[j].creatingDate = $scope.editCommentModal.creatingDate;
							$scope.comments[i].children[j].changed = $scope.editCommentModal.changed;
						}
					}
				}
			});
		}else{
			toast('Ne mozete izmeniti komentar');
		}
	}
	$scope.deleteComment = function(comment){
		if(comment.deleted){
			toast('Komentar je vec obrisan');
			return;
		}
		if($scope.isAdministrator()){
			console.log("admin");
			commentFactory.deleteComment(comment).success(function(data){
				toast(data);
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == comment.text){
						$scope.comments[i].deleted = true;
						for(j = 0; j < $scope.comments[i].children.length; j++)
							$scope.comments[i].children[j].deleted = true;
					}else{
						for(j = 0; j < $scope.comments[i].children.length; j++){
							if($scope.comments[i].children[j].text == comment.text)
								$scope.comments[i].children[j].deleted = true;
						}
					}
				}
			});
		}else if($scope.activeUser.username == comment.theme.subforum.responibleModerator){
			console.log("odgovorniModerator");
			commentFactory.deleteComment(comment).success(function(data){
				toast(data);
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == comment.text){
						$scope.comments[i].deleted = true;
						for(j = 0; j < $scope.comments[i].children.length; j++)
							$scope.comments[i].children[j].deleted = true;
					}else{
						for(j = 0; j < $scope.comments[i].children.length; j++){
							if($scope.comments[i].children[j].text == comment.text)
								$scope.comments[i].children[j].deleted = true;
						}
					}
				}
			});
		}else if($scope.activeUser.username == comment.author){
			console.log("autor");
			commentFactory.deleteComment(comment).success(function(data){
				toast(data);
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == comment.text){
						$scope.comments[i].deleted = true;
						for(j = 0; j < $scope.comments[i].children.length; j++)
							$scope.comments[i].children[j].deleted = true;
					}else{
						for(j = 0; j < $scope.comments[i].children.length; j++){
							if($scope.comments[i].children[j].text == comment.text)
								$scope.comments[i].children[j].deleted = true;
						}
					}
				}
			});
		}else{
			toast('Ne mozete obrisati komentar');
		}
	}
	$scope.saveComment = function(comment){
		if(comment.deleted){
			toast('Ne mozete snimiti obrisan komentar');
			return;
		}
		$scope.isSaved = false;
		for(i = 0; i < $scope.savedComments.length; i++){
			if($scope.savedComments[i].text == comment.text)
				$scope.isSaved = true;
		}
		if(!$scope.isSaved){
			$scope.savedComments.push(comment);
			for(i = 0; i < $scope.comments.length; i++){
				if($scope.comments[i].text == comment.text){
					commentFactory.saveComment($scope.activeUser.username, $scope.comments[i]).success(function(data){
						toast(data);
					});
				}else{
					for(j = 0; j < $scope.comments[i].children.length; j++){
						if($scope.comments[i].children[j].text == comment.text){
							commentFactory.saveComment($scope.activeUser.username, $scope.comments[i].children[j]).success(function(data){
								toast(data);
							});
						}
					}
				}
			}
		}else{
			toast('Vec ste snimili ovaj komentar');
		}
	}
	$scope.likeComment = function(comment){
		if(comment.deleted){
			toast('Ne mozete lajkovati obrisan komentar');
			return;
		}
		commentFactory.likeComment($scope.activeUser.username, comment).success(function(data){
			if(data == "Komentar je lajkovan"){
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == comment.text){
						$scope.comments[i].likes++;
						$scope.comments[i].usersLiked.push($scope.activeUser.username);
						$scope.likedComments.push(comment);
					}else{
						for(j = 0; j < $scope.comments[i].children.length; j++){
							if($scope.comments[i].children[j].text == comment.text){
								$scope.comments[i].children[j].likes++;
								$scope.comments[i].children[j].usersLiked.push($scope.activeUser.username);
								$scope.likedComments.push(comment);
							}
						}
					}
				}
				toast(data);
			}else{
				toast(data);
			}
		});
	}
	$scope.dislikeComment = function(comment){
		if(comment.deleted){
			toast('Ne mozete dislajkovati obrisan komentar');
			return;
		}
		commentFactory.dislikeComment($scope.activeUser.username, comment).success(function(data){
			if(data == "Komentar je dislajkovan"){
				for(i = 0; i < $scope.comments.length; i++){
					if($scope.comments[i].text == comment.text){
						$scope.comments[i].dislikes++;
						$scope.comments[i].usersDisliked.push($scope.activeUser.username);
					}else{
						for(j = 0; j < $scope.comments[i].children.length; j++){
							if($scope.comments[i].children[j].text == comment.text){
								$scope.comments[i].children[j].dislikes++;
								$scope.comments[i].children[j].usersDisliked.push($scope.activeUser.username);
							}
						}
					}
				}
				toast(data);
			}else{
				toast(data);
			}
		});
	}
	$scope.likeTheme = function(theme){
		themeFactory.likeTheme($scope.activeUser.username, theme).success(function(data){
			if(data == "Tema lajkovana"){
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == theme.name){
						$scope.themes[i].likes++;
						$scope.themes[i].usersLiked.push($scope.activeUser.username);
						$scope.likedThemes.push(theme);
					}
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == theme.name){
						$scope.themesOfFollowedSubforums[i].likes++;
						$scope.themesOfFollowedSubforums[i].usersLiked.push($scope.activeUser.username);
					}
				}
				toast(data);
			}else{
				toast(data);
			}
		});
	}
	$scope.dislikeTheme = function(theme){
		themeFactory.dislikeTheme($scope.activeUser.username, theme).success(function(data){
			if(data == "Tema dislajkovana"){
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == theme.name){
						$scope.themes[i].dislikes++;
						$scope.themes[i].usersDisliked.push($scope.activeUser.username);
						$scope.dislikedThemes.push(theme);
					}
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == theme.name){
						$scope.themesOfFollowedSubforums[i].dislikes++;
						$scope.themesOfFollowedSubforums[i].usersDisliked.push($scope.activeUser.username);
					}
				}
				toast(data);
			}else{
				toast(data);
			}
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
			var datum = new Date();
			var noviDatum = $filter('date')(datum, "dd-MM-yyyy HH:mm");
			$scope.newTheme.subforum = $scope.subforumDetail;
			$scope.newTheme.creatingDate = noviDatum;
			themeFactory.addTheme($scope.newTheme).success(function(data){
				if(data == "Uspesno kreirana tema"){
					toast(data);
				}else{
					toast(data);
				}
			});
		}
	}
	$scope.saveTheme = function(theme) {
		$scope.isSaved = false;
		for(i = 0; i < $scope.savedThemes.length; i++){
			if($scope.savedThemes[i].name == theme.name)
				$scope.isSaved = true;
		}
		if(!$scope.isSaved){
			$scope.savedThemes.push(theme);
			for(i = 0; i < $scope.themes.length; i++){
				if($scope.themes[i].name == theme.name){
					themeFactory.saveTheme($scope.activeUser.username, $scope.themes[i]).success(function(data){
						toast(data);
					});
				}
			}
		}else{
			toast('Vec ste snimili ovu temu');
		}
	}
	$scope.editTheme = function(theme){
		var date = new Date();
		var newDate = $filter('date')(date, "dd-MM-yyyy HH:mm");
		$scope.editThemeModal = { "subforum" : theme.subforum, "name" : theme.name, "type" : theme.type, "author" : theme.author, "comments" : theme.comments,
			"content" : theme.content, "creatingDate" : newDate, "likes" : theme.likes, "dislikes" : theme.dislikes }

	}
	$scope.cancelEditTheme = function(){
		$scope.editThemeModal = null;
	}
	$scope.saveEditTheme = function(){
		if($scope.isAdministrator()){
			themeFactory.editTheme($scope.editThemeModal).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == $scope.editThemeModal.name){
						$scope.themes[i].type = $scope.editThemeModal.type;
						$scope.themes[i].content = $scope.editThemeModal.content;
						$scope.themes[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == $scope.editThemeModal.name){
						$scope.themesOfFollowedSubforums[i].type = $scope.editThemeModal.type;
						$scope.themesOfFollowedSubforums[i].content = $scope.editThemeModal.content;
						$scope.themesOfFollowedSubforums[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
			});
		}else if($scope.activeUser.username == $scope.editThemeModal.subforum.responibleModerator){
			console.log("odgovorni")
			themeFactory.editTheme($scope.editThemeModal).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == $scope.editThemeModal.name){
						$scope.themes[i].type = $scope.editThemeModal.type;
						$scope.themes[i].content = $scope.editThemeModal.content;
						$scope.themes[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == $scope.editThemeModal.name){
						$scope.themesOfFollowedSubforums[i].type = $scope.editThemeModal.type;
						$scope.themesOfFollowedSubforums[i].content = $scope.editThemeModal.content;
						$scope.themesOfFollowedSubforums[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
			});
		}else if($scope.activeUser.username == $scope.editThemeModal.author){
			console.log("autor")
			themeFactory.editTheme($scope.editThemeModal).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == $scope.editThemeModal.name){
						$scope.themes[i].type = $scope.editThemeModal.type;
						$scope.themes[i].content = $scope.editThemeModal.content;
						$scope.themes[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == $scope.editThemeModal.name){
						$scope.themesOfFollowedSubforums[i].type = $scope.editThemeModal.type;
						$scope.themesOfFollowedSubforums[i].content = $scope.editThemeModal.content;
						$scope.themesOfFollowedSubforums[i].creatingDate = $scope.editThemeModal.creatingDate;
					}
				}
			});
		}else{
			toast('Ne mozete izmeniti ovu temu');
		}
	}
	$scope.deleteTheme = function(theme){
		if($scope.isAdministrator()){
			themeFactory.deleteTheme(theme).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == theme.name)
						$scope.themes.splice(i,1);
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == theme.name){
						$scope.themesOfFollowedSubforums.splice(i,1);
					}
				}
			});
			$scope.themeDetails = false;
		}else if($scope.activeUser.username == theme.subforum.responibleModerator){
			themeFactory.deleteTheme(theme).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == theme.name)
						$scope.themes.splice(i,1);
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == theme.name){
						$scope.themesOfFollowedSubforums.splice(i,1);
					}
				}
			});
			$scope.themeDetails = false;
		}else if($scope.activeUser.username == theme.author){
			themeFactory.deleteTheme(theme).success(function(data){
				toast(data);
				for(i = 0; i < $scope.themes.length; i++){
					if($scope.themes[i].name == theme.name)
						$scope.themes.splice(i,1);
				}
				for(i = 0; i < $scope.themesOfFollowedSubforums.length; i++){
					if($scope.themesOfFollowedSubforums[i].name == theme.name){
						$scope.themesOfFollowedSubforums.splice(i,1);
					}
				}
			});
			$scope.themeDetails = false;
		}else{
			toast('Ne mozete obrisati temu');
		}
	}
	$scope.cancelNewTheme = function(){
		themeFactory.getThemes($scope.subforumDetail.name).success(function(data){
			$scope.themes = data;
			$scope.searchThemes = data;
		});
		$scope.newTheme.name = null;
		$scope.newTheme.type = null;
		$scope.newTheme.content = null;
	}
	$scope.praceniPodforumi = function(){
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = true;
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		subforumFactory.getFollowSubforums($scope.activeUser.username).success(function(data){
			$scope.followedSubforums = data;
			if($scope.followedSubforums.length == 0){
				$scope.followedSubforumsView = false;
				$scope.followSubforumsMessage = "Ne pratite nijedan podforum.";
			}else{
				$scope.followedSubforumsView = true;
				$scope.followSubforumsMessage = "";
			}
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
		$scope.viewFollowedSubforums = false;
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
		$scope.viewHome = false;
		$scope.viewSaveEnt = false;
		$scope.viewLikeDislike = false;
		$scope.viewFollowedSubforums = false;
		$scope.subforumDetails = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.newMessage = false;
		$scope.editProfile = true;
		userFactory.getUsers($scope.activeUser.username).success(function(data){
			$scope.users = data;
			$scope.usersSearch = data;
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
		$location.path('/');
	} 	 	
	$scope.goToInbox = function() {
		$scope.viewHome = false;
		$scope.viewSaveEnt = false;
		$scope.viewLikeDislike = false;
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.editProfile = false;
		$scope.viewInbox = true;
		$scope.newMessage = false;
		$scope.showTableInbox = true;
		messageFactory.inbox($scope.activeUser.username).success(function(data){
			$scope.inbox = data;
			if($scope.inbox.length == 0){
				$scope.showTableInbox = false;
				$scope.emptyInbox = "Nema primljenih poruka.";
			}else{
				$scope.emptyInbox = "";
			}
		});
	}
	$scope.novaPoruka = function() {
		$scope.subforumDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
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
	$scope.goToLikeDislike = function(){
		$scope.viewHome = false;
		$scope.viewSaveEnt = false;
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.editProfile = false;
		$scope.newMessage = false;
		$scope.viewLikeDislike = true;
		$scope.likedThemesTable = true;
		$scope.likedThemesMessage = "";
		$scope.dislikedThemesTable = true;
		$scope.dislikedThemesMessage = "";
		$scope.likedCommentsMessage = "";
		$scope.dislikedCommentsMessage = "";
		themeFactory.getLikedThemes($scope.activeUser.username).success(function(data){
			$scope.likedThemes = data;
			if($scope.likedThemes.length == 0){
				$scope.likedThemesTable = false;
				$scope.likedThemesMessage = "Nemate tema sa pozitivnim glasovima.";
			}
		});
		themeFactory.getDislikedThemes($scope.activeUser.username).success(function(data){
			$scope.dislikedThemes = data;
			if($scope.dislikedThemes.length == 0){
				$scope.dislikedThemesTable = false;
				$scope.dislikedThemesMessage = "Nemate tema sa negativnim glasovima.";
			}
		});
		commentFactory.getLikedComments($scope.activeUser.username).success(function(data){
			$scope.likedComments = data;
			if($scope.likedComments.length == 0)
				$scope.likedCommentsMessage = "Nemate komentare sa pozitivnim glasovima.";
			else
				$scope.likedCommentsMessage = "Komentari sa pozitivnim glasovima:";
		});
		commentFactory.getDislikedComments($scope.activeUser.username).success(function(data){
			$scope.dislikedComments = data;
			if($scope.dislikedComments.length == 0)
				$scope.dislikedCommentsMessage = "Nemate komentare sa negativnim glasovima.";
			else
				$scope.dislikedCommentsMessage = "Komentari sa negativnim glasovima:";
		});
	}
	$scope.dislikeLiked = function(theme){
		themeFactory.dislikeLikedTheme($scope.activeUser.username, theme).success(function(data){
			toast(data);
			for(i = 0; i < $scope.likedThemes.length; i++){
				if($scope.likedThemes[i].name == theme.name)
					$scope.likedThemes.splice(i,1);
			}
			if($scope.likedThemes.length == 0){
				$scope.likedThemesTable = false;
				$scope.likedThemesMessage = "Nemate tema sa pozitivnim glasom.";
			}
		});
	}
	$scope.likeDisliked = function(theme){
		themeFactory.likeDislikedTheme($scope.activeUser.username, theme).success(function(data){
			toast(data);
			for(i = 0; i < $scope.dislikedThemes.length; i++){
				if($scope.dislikedThemes[i].name == theme.name)
					$scope.dislikedThemes.splice(i,1);
			}
			if($scope.dislikedThemes.length == 0){
				$scope.dislikedThemesTable = false;
				$scope.dislikedThemesMessage = "Nemate tema sa negativnim glasom.";
			}
		});
	}
	$scope.dislikeLikedCom = function(comment){
		if(comment.deleted){
			toast('Ne mozete lajkovati obrisan komentar');
			return;
		}
		commentFactory.dislikeLikedComment($scope.activeUser.username, comment).success(function(data){
			toast(data);
			for(i = 0; i < $scope.likedComments.length; i++){
				if($scope.likedComments[i].text == comment.text)
					$scope.likedComments.splice(i,1);
			}
			if($scope.likedComments.length == 0)
				$scope.likedCommentsMessage = "Nemate komentare sa pozitivnim glasovima.";
		});
	}
	$scope.likeDislikedCom = function(comment){
		if(comment.deleted){
			toast('Ne mozete dislajkovati obrisan komentar');
			return;
		}
		commentFactory.likeDislikedComment($scope.activeUser.username, comment).success(function(data){
			toast(data);
			for(i = 0; i < $scope.dislikedComments.length; i++){
				if($scope.dislikedComments[i].text == comment.text)
					$scope.dislikedComments.splice(i,1);
			}
			if($scope.dislikedComments.length == 0)
				$scope.dislikedCommentsMessage = "Nemate komentare sa negativnim glasovima.";
		});
	}
	$scope.goToSaveEnt = function(){
		$scope.viewHome = false;
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.editProfile = false;
		$scope.newMessage = false;
		$scope.viewLikeDislike = false;
		$scope.viewSaveEnt = true;
		$scope.savedThemesTable = true;
		$scope.savedThemesMessage = "";
		$scope.savedCommentsMessage = "";
		themeFactory.getSavedThemes($scope.activeUser.username).success(function(data){
			$scope.savedThemes = data;
			if($scope.savedThemes.length == 0){
				$scope.savedThemesTable = false;
				$scope.savedThemesMessage = "Nemate sacuvanih tema";
			}
		});
		commentFactory.getSavedComments($scope.activeUser.username).success(function(data){
			$scope.savedComments = data;
			if($scope.savedComments.length == 0){
				$scope.savedCommentsMessage = "Nemate sacuvanih komentara";
			}else{
				$scope.savedCommentsMessage = "Sacuvani komentari:";
			}
		});
		
	}
	$scope.removeSavedTheme = function(theme){
		themeFactory.removeSavedTheme($scope.activeUser.username, theme).success(function(data){
			toast(data);
			for(i = 0; i < $scope.savedThemes.length; i++){
				if($scope.savedThemes[i].name == theme.name)
					$scope.savedThemes.splice(i,1);
			}
			if($scope.savedThemes.length == 0){
				$scope.savedThemesTable = false;
				$scope.savedThemesMessage = "Nemate sacuvanih tema";
			}
		});
	}
	$scope.removeSavedComment = function(comment){
		commentFactory.removeSavedComment($scope.activeUser.username, comment).success(function(data){
			toast(data);
			for(i = 0; i < $scope.savedComments.length; i++){
				if($scope.savedComments[i].text == comment.text)
					$scope.savedComments.splice(i,1);
			}
			if($scope.savedComments.length == 0)
				$scope.savedCommentsMessage = "Nemate sacuvanih komentara";
		});
	}
	function goToHome(){
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.editProfile = false;
		$scope.newMessage = false;
		$scope.viewLikeDislike = false;
		$scope.viewSaveEnt = false;
		$scope.viewHome = true;
		themeFactory.getThemesOfFollowedSubforums($scope.activeUser.username).success(function(data){
			$scope.themesOfFollowedSubforums = data;
		});
	}
	$scope.goToHomePage = function(){
		$scope.subforumDetails = false;
		$scope.themeDetails = false;
		$scope.viewFollowedSubforums = false;
		$scope.viewSubforum = false;
		$scope.newSubforum = false;
		$scope.viewInbox = false;
		$scope.editProfile = false;
		$scope.newMessage = false;
		$scope.viewLikeDislike = false;
		$scope.viewSaveEnt = false;
		$scope.viewHome = true;
		themeFactory.getThemesOfFollowedSubforums($scope.activeUser.username).success(function(data){
			$scope.themesOfFollowedSubforums = data;
		});
	}
	$scope.searchSubforum = function(){
		if(!$scope.searchSub.name)
			$scope.searchSub.name = null;
		if(!$scope.searchSub.description)
			$scope.searchSub.description = null;
		if(!$scope.searchSub.responsibleModerator)
			$scope.searchSub.responsibleModerator = null;
		
		subforumFactory.search($scope.searchSub.name, $scope.searchSub.description, $scope.searchSub.responsibleModerator).success(function(data){
			if(($scope.searchSub.name == null) && ($scope.searchSub.description == null) && ($scope.searchSub.responsibleModerator == null)){
				$scope.subforums = $scope.searchSubforums;
			}else{
				$scope.subforums = data;
			}
		});
	}
	$scope.searchUsers = function(){
		if(!$scope.searchUsername)
			$scope.searchUsername = null;
		userFactory.search($scope.searchUsername).success(function(data){
			if($scope.searchUsername == null)
				$scope.users = $scope.usersSearch;
			else
				$scope.users = data;
		});
	}
	$scope.searchTheme = function(){
		if(!$scope.searchTheme.tag)
			$scope.searchTheme.tag = null;
		if(!$scope.searchTheme.content)
			$scope.searchTheme.content = null;
		if(!$scope.searchTheme.author)
			$scope.searchTheme.author = null;
		
		themeFactory.search($scope.searchTheme.tag, $scope.searchTheme.content, $scope.searchTheme.author).success(function(data){
			if(($scope.searchTheme.tag == null) && ($scope.searchTheme.content == null) && ($scope.searchTheme.author == null)){
				$scope.themes = $scope.searchThemes;
			}else{
				$scope.themes = data;
			}
		});
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
					$location.path('/');
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
			return "Potrebno je uneti korisnicko ime  i lozinku."
		
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
