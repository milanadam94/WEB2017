package controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import fileControllers.CommentFileController;
import fileControllers.ThemeFileController;
import fileControllers.UserFileController;
import models.Comment;
import models.Subforum;
import models.Theme;
import models.User;

@Path("/theme")
public class ThemeController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/addTheme")
	@Consumes(MediaType.APPLICATION_JSON)
	public String addTheme(Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> themesOfSubforum = new ArrayList<Theme>();
		for (Theme t : themes) {
			if(t.getSubforum().getName().equals(theme.getSubforum().getName()))
				themesOfSubforum.add(t);
		}
		for (Theme t : themesOfSubforum) {
			if(t.getName().equals(theme.getName()))
				return "Postoji vec tema sa tim naslovom u okviru foruma";
		}
		Theme tema = new Theme(theme.getSubforum(), theme.getName(), theme.getType(), theme.getAuthor(), theme.getContent(), 
				theme.getCreatingDate(), 0, 0);
		themes.add(tema);
		ThemeFileController.writeTheme(config, themes);
		
		return "Uspesno kreirana tema";
	}
	
	@POST
	@Path("/editTheme")
	@Consumes(MediaType.APPLICATION_JSON)
	public String editTheme(Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		
		for(int i = 0; i < users.size(); i++){
			ArrayList<Theme> savedThemes = users.get(i).getThemes();
			for(int j = 0; j < savedThemes.size(); j++){
				if(savedThemes.get(j).getName().equals(theme.getName())){
					users.get(i).removeSavedTheme(savedThemes.get(j));
					users.get(i).saveTheme(theme);
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		
		for(int i = 0; i < comments.size(); i++){
			if(comments.get(i).getTheme().getName().equals(theme.getName())){
				comments.get(i).getTheme().setType(theme.getType());
				comments.get(i).getTheme().setContent(theme.getContent());
				comments.get(i).getTheme().setCreatingDate(theme.getCreatingDate());
			}
		}
		CommentFileController.writeComment(config, comments);
		
		for (int i = 0; i < themes.size(); i++) {
			if(themes.get(i).getName().equals(theme.getName())){
				themes.get(i).setType(theme.getType());
				themes.get(i).setContent(theme.getContent());
				themes.get(i).setCreatingDate(theme.getCreatingDate());
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		
		return "Uspesno izmenjena tema";
	}
	
	@POST
	@Path("/deleteTheme")
	@Consumes(MediaType.APPLICATION_JSON)
	public String deleteTheme(Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		
		for(int i = 0; i < users.size(); i++){
			ArrayList<Theme> savedThemes = users.get(i).getThemes();
			for(int j = 0; j < savedThemes.size(); j++){
				if(savedThemes.get(j).getName().equals(theme.getName())){
					users.get(i).removeSavedTheme(savedThemes.get(j));
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				themes.remove(i);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		
		for(int i = 0; i < comments.size(); i++){
			if(comments.get(i).getTheme().getName().equals(theme.getName())){
				comments.remove(i);
			}
		}
		CommentFileController.writeComment(config, comments);
		
		return "Uspesno obrisana tema";
	}
	
	@GET
	@Path("/getThemes/{subforumName}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getThemes(@PathParam(value = "subforumName") String subforumName) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> themesOfSubforum = new ArrayList<Theme>();
		for (Theme t : themes) {
			if(t.getSubforum().getName().equals(subforumName))
				themesOfSubforum.add(t);
		}
		return themesOfSubforum;
	}
	
	@GET
	@Path("/getSavedThemes/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getSavedThemes(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for (User user : users) {
			if(user.getUsername().equals(username)){
				return user.getThemes();
			}
		}
		return null;
	}
	
	@POST
	@Path("/saveTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String saveTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for (User user : users) {
			if(user.getUsername().equals(username)){
				user.saveTheme(theme);
				break;
			}
		}
		UserFileController.writeUser(config, users);
		return "Snimili ste temu";
	}
	
	@POST
	@Path("/removeSavedTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String removeSavedTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for(int i = 0; i < users.size(); i++){
			if(users.get(i).getUsername().equals(username)){
				for(int j = 0; j < users.get(i).getThemes().size(); j++){
					if(users.get(i).getThemes().get(j).getName().equals(theme.getName())){
						users.get(i).getThemes().remove(j);
						break;
					}
				}
			}
		}
		UserFileController.writeUser(config, users);
		return "Tema obrisana";
	}
	
	@POST
	@Path("/likeTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String likeTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				for(String user : themes.get(i).getUsersDisliked()){
					if(user.equals(username))
						return "Vec ste dislajkovali temu";
				}
				for(String user : themes.get(i).getUsersLiked()){
					if(user.equals(username))
						return "Vec ste lajkovali temu";
				}
				themes.get(i).setLikes(themes.get(i).getLikes() + 1);
				themes.get(i).addUserLiked(username);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		for(User user : users){
			ArrayList<Theme> userThemes = user.getThemes();
			for(int j = 0; j < userThemes.size(); j++){
				if(userThemes.get(j).getName().equals(theme.getName())){
					userThemes.get(j).setLikes(userThemes.get(j).getLikes() + 1);
					userThemes.get(j).addUserLiked(username);
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		return "Tema lajkovana";
	}
	
	@POST
	@Path("/dislikeTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String dislikeTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				for(String user : themes.get(i).getUsersDisliked()){
					if(user.equals(username))
						return "Vec ste dislajkovali temu";
				}
				for(String user : themes.get(i).getUsersLiked()){
					if(user.equals(username))
						return "Vec ste lajkovali temu";
				}
				themes.get(i).setDislikes(themes.get(i).getDislikes() + 1);
				themes.get(i).addUserDisliked(username);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		for(User user : users){
			ArrayList<Theme> userThemes = user.getThemes();
			for(int j = 0; j < userThemes.size(); j++){
				if(userThemes.get(j).getName().equals(theme.getName())){
					userThemes.get(j).setDislikes(userThemes.get(j).getDislikes() + 1);
					userThemes.get(j).addUserDisliked(username);
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		return "Tema dislajkovana";
	}
	
	@GET
	@Path("/getLikedThemes/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getLikedThemes(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> likedThemes = new ArrayList<Theme>();
		for(Theme t : themes){
			ArrayList<String> users = t.getUsersLiked();
			for(String user : users){
				if(user.equals(username)){
					likedThemes.add(t);
				}
			}
		}
		return likedThemes;
	}
	
	@GET
	@Path("/getDislikedThemes/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getDislikedThemes(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> dislikedThemes = new ArrayList<Theme>();
		for(Theme t : themes){
			ArrayList<String> users = t.getUsersDisliked();
			for(String user : users){
				if(user.equals(username)){
					dislikedThemes.add(t);
				}
			}
		}
		return dislikedThemes;
	}
	
	@POST
	@Path("/dislikeLikedTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String dislikeLikedTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				themes.get(i).removeUserLiked(username);
				themes.get(i).setLikes(themes.get(i).getLikes() - 1);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		for(User user : users){
			ArrayList<Theme> userThemes = user.getThemes();
			for(int j = 0; j < userThemes.size(); j++){
				if(userThemes.get(j).getName().equals(theme.getName())){
					userThemes.get(j).setLikes(userThemes.get(j).getLikes() - 1);
					userThemes.get(j).removeUserLiked(username);
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		
		return "Tema dislajkovana";
	}
	
	@POST
	@Path("/likeDislikedTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String likeDislikedTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				themes.get(i).removeUserDisliked(username);
				themes.get(i).setDislikes(themes.get(i).getDislikes() - 1);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		
		for(User user : users){
			ArrayList<Theme> userThemes = user.getThemes();
			for(int j = 0; j < userThemes.size(); j++){
				if(userThemes.get(j).getName().equals(theme.getName())){
					userThemes.get(j).setDislikes(userThemes.get(j).getDislikes() - 1);
					userThemes.get(j).removeUserDisliked(username);
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		return "Tema lajkovana";
	}
	
	@GET
	@Path("/getThemesOfFollowedSubforums/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getThemesOfFollowedSubforums(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> retThemes = new ArrayList<Theme>();
		for(int i = 0; i < users.size(); i++){
			if(users.get(i).getUsername().equals(username)){
				ArrayList<Subforum> followedSubforums = users.get(i).getSubforums();
				for(int j = 0; j < followedSubforums.size(); j++){
					for(int m = 0; m < themes.size(); m++){
						if(themes.get(m).getSubforum().getName().equals(followedSubforums.get(j).getName())){
							retThemes.add(themes.get(m));
						}
					}
				}
			}
		}
		return retThemes;
	}
	
	@GET
	@Path("/search/{name}/{content}/{author}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> search(@PathParam(value = "name") String name, @PathParam(value = "content") String content,
			@PathParam(value = "author") String author) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> retThemes = new ArrayList<Theme>();
		
		for(int i = 0; i < themes.size(); i++){
			if((themes.get(i).getName().startsWith(name)) && (themes.get(i).getContent().startsWith(content)) && (themes.get(i).getAuthor().startsWith(author))){
				retThemes.add(themes.get(i));
			}else if((themes.get(i).getName().startsWith(name)) && (themes.get(i).getContent().startsWith(content)) && (author != null && !author.equals(""))){
				retThemes.add(themes.get(i));
			}else if((themes.get(i).getName().startsWith(name)) && (content != null && !content.equals("")) && (themes.get(i).getAuthor().startsWith(author))){
				retThemes.add(themes.get(i));
			}else if((name != null && !name.equals("")) && (themes.get(i).getContent().startsWith(content)) && (themes.get(i).getAuthor().startsWith(author))){
				retThemes.add(themes.get(i));
			}else if((name != null && !name.equals("")) && (content != null && !content.equals("")) && (themes.get(i).getAuthor().startsWith(author))){
				retThemes.add(themes.get(i));
			}else if((name != null && !name.equals("")) && (themes.get(i).getContent().startsWith(content)) && (author != null && !author.equals(""))){
				retThemes.add(themes.get(i));
			}else if((themes.get(i).getName().startsWith(name)) && (content != null && !content.equals("")) && (author != null && !author.equals(""))){
				retThemes.add(themes.get(i));
			}else{
				
			}
		}
		return retThemes;
	}
}
