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
}
