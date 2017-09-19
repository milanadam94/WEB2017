package controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import fileControllers.SubforumFileController;
import fileControllers.ThemeFileController;
import fileControllers.UserFileController;
import models.Subforum;
import models.Theme;
import models.User;

@Path("/subforum")
public class SubforumController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/addSubforum")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public synchronized String addSubforum(@FormDataParam("name") String name, @FormDataParam("rules") String rules, 
			@FormDataParam("description") String description, @FormDataParam("responibleModerator") String responibleModerator,
			@FormDataParam("file") InputStream in, @FormDataParam("file") FormDataContentDisposition info) throws FileNotFoundException, IOException{
	
		String s = config.getServletContext().getRealPath("");
		String path = getMediaPath(s).getPath();
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		
		for (Subforum subforum : subforums) {
			if(subforum.getName().equals(name)){
				return "Postoji podforum sa tim nazivom";
			}
		}
		Subforum subforum = new Subforum(name, description, null, rules, responibleModerator, null);
		subforums.add(subforum);
		SubforumFileController.writeSubforum(config, subforums);
	
		try {
			int read = 0;
			File file = new File(path + "//" + "icons" + "//" +info.getFileName());
			for(Subforum sub : subforums){
				if(sub.getName().equals(name)){
					sub.setIconPath(file.getName());
					SubforumFileController.writeSubforum(config, subforums);
					break;
				}
			}
			byte[] bytes = new byte[1024];
			OutputStream out = new FileOutputStream(file);
			while((read=in.read(bytes))!= -1){
				out.write(bytes, 0, read);
			}
			out.flush();
			out.close();
		} catch (IOException e) {
			return "Internal server error";
		}
		return "Uspesno kreiran podforum";
	}
	
	@GET
	@Path("/getSubforums")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Subforum> getSubforums() throws FileNotFoundException, IOException{
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		return subforums;
	}
	
	@POST
	@Path("/deleteSubforum")
	@Consumes(MediaType.APPLICATION_JSON)
	public String deleteSubforum(Subforum subforum) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		
		for(int i = 0; i < users.size(); i++){
			ArrayList<Subforum> followSub = users.get(i).getSubforums();
			for(int j = 0; j < followSub.size(); j++){
				if(followSub.get(j).getName().equals(subforum.getName())){
					users.get(i).removeSubforum(followSub.get(j));
					break;
				}
			}
		}
		UserFileController.writeUser(config, users);
		for(int i = 0; i < subforums.size(); i++){
			if(subforums.get(i).getName().equals(subforum.getName())){
				subforums.remove(i);
				break;
			}
		}
		SubforumFileController.writeSubforum(config, subforums);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getSubforum().getName().equals(subforum.getName())){
				themes.remove(i);
			}
		}
		ThemeFileController.writeTheme(config, themes);
		return "Uspesno obrisan podforum.";
	}
	
	@POST
	@Path("/addFollowSubforum/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String addFollowSubforum(@PathParam(value = "username") String username, Subforum subforum) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for(User user : users){
			if(user.getUsername().equals(username)){
				user.addSubforum(subforum);
				break;
			}
		}
		UserFileController.writeUser(config, users);
		return "Zapratili ste podforum.";
	}
	
	@POST
	@Path("/unfollowSubforum/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String unfollowSubforum(@PathParam(value = "username") String username, Subforum subforum) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for(User user : users){
			if(user.getUsername().equals(username)){
				for(int i = 0; i < user.getSubforums().size(); i++){
					if(user.getSubforums().get(i).getName().equals(subforum.getName())){
						user.getSubforums().remove(i);
						break;
					}
				}
				break;
			}
		}
		UserFileController.writeUser(config, users);
		return "Otpratili ste podforum.";
	}
	
	@GET
	@Path("/getFollowSubforums/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Subforum> getfollowSubforums(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for(User user : users){
			if(user.getUsername().equals(username)){
				return user.getSubforums();
			}
		}
		return null;
	}
	public File getMediaPath(String s){
		File pathDatabase = new File(s);
		if(!pathDatabase.exists()){
			pathDatabase.mkdir();
		}
		return pathDatabase;
	}
	
	@GET
	@Path("/search/{name}/{description}/{responsibleModerator}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Subforum> search(@PathParam(value = "name") String name, @PathParam(value = "description") String description,
			@PathParam(value = "responsibleModerator") String responsibleModerator) throws FileNotFoundException, IOException{
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		ArrayList<Subforum> retSubforums = new ArrayList<Subforum>();
		
		for(int i = 0; i < subforums.size(); i++){
			if((subforums.get(i).getName().startsWith(name)) && (subforums.get(i).getDescription().startsWith(description)) && (subforums.get(i).getResponibleModerator().startsWith(responsibleModerator))){
				retSubforums.add(subforums.get(i));
				//System.out.println("111");
			}else if((subforums.get(i).getName().startsWith(name)) && (subforums.get(i).getDescription().startsWith(description)) && (responsibleModerator != null && !responsibleModerator.equals(""))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("110");
			}else if((subforums.get(i).getName().startsWith(name)) && (description != null && !description.equals("")) && (subforums.get(i).getResponibleModerator().startsWith(responsibleModerator))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("101");
			}else if((name != null && !name.equals("")) && (subforums.get(i).getDescription().startsWith(description)) && (subforums.get(i).getResponibleModerator().startsWith(responsibleModerator))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("011");
			}else if((name != null && !name.equals("")) && (description != null && !description.equals("")) && (subforums.get(i).getResponibleModerator().startsWith(responsibleModerator))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("001");
			}else if((name != null && !name.equals("")) && (subforums.get(i).getDescription().startsWith(description)) && (responsibleModerator != null && !responsibleModerator.equals(""))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("010");
			}else if((subforums.get(i).getName().startsWith(name)) && (description != null && !description.equals("")) && (responsibleModerator != null && !responsibleModerator.equals(""))) {
				retSubforums.add(subforums.get(i));
				//System.out.println("100");
			}else{
				//System.out.println("000");
				//return subforums;
			}
		}
		
		return retSubforums;
	}
}
