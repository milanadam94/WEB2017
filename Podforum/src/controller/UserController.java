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

import fileControllers.UserFileController;
import models.Role;
import models.User;

@Path("/user")
public class UserController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/addUser")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String addUser(User user) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		
		for (User userSaved : users) {
			if(userSaved.getUsername().equals(user.getUsername()))
				return "Postoji korisnik sa ovim korisnickim imenom";
		}
		
		users.add(user);
		UserFileController.writeUser(config, users);
		
		return "Korisnik uspesno registrovan";
	}
	
	@POST
	@Path("/changeRole/{username}/{role}")
	@Produces(MediaType.TEXT_PLAIN)
	public String changeRole(@PathParam(value="username") String username, @PathParam(value="role") String role) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for (User user : users) {
			if(user.getUsername().equals(username)){
				user.setRole(Role.valueOf(role));
			}
		}
		UserFileController.writeUser(config, users);
		return "Promenjen tip korisnika";
	}
	@GET
	@Path("/getUser/{username}/{password}")
	@Produces(MediaType.APPLICATION_JSON)
	public User getUser(@PathParam(value="username") String username, @PathParam(value="password") String password) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		for (User user : users) {
			if(user.getUsername().equals(username) && user.getPassword().equals(password))
				return user;
		}
		return null;
	}
	
	@GET
	@Path("/getUsers/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> getUsers(@PathParam(value="username") String username) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<User> sendUsers = new ArrayList<>();
 		for (User user : users) {
			if(user.getUsername().equals(username))
				System.out.println("Jaa");
			else
				sendUsers.add(user);
		}
		return sendUsers;
	}
	
	@GET
	@Path("/search/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> search(@PathParam(value="username") String username) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<User> retUsers = new ArrayList<User>();
		for(int i = 0; i < users.size(); i++){
			if(users.get(i).getUsername().startsWith(username)){
				retUsers.add(users.get(i));
			}
		}
		return retUsers;
	}
}
