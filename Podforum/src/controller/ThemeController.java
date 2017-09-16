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
	@Path("/likeTheme/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String likeTheme(@PathParam(value = "username") String username, Theme theme) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<User> users = UserFileController.readUser(config);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(theme.getName())){
				for(String user : themes.get(i).getUsersDisliked()){
					if(user.equals(username))
						return "Vec ste dislajkovali";
				}
				for(String user : themes.get(i).getUsersLiked()){
					if(user.equals(username))
						return "Vec ste lajkovali";
				}
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
				themes.get(i).setLikes(themes.get(i).getLikes() + 1);
				themes.get(i).addUserLiked(username);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
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
						return "Vec ste dislajkovali";
				}
				for(String user : themes.get(i).getUsersLiked()){
					if(user.equals(username))
						return "Vec ste lajkovali";
				}
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
				themes.get(i).setDislikes(themes.get(i).getDislikes() + 1);
				themes.get(i).addUserDisliked(username);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		UserFileController.writeUser(config, users);
		return "Tema dislajkovana";
	}
}
