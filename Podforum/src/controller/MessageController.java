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

import fileControllers.MessageFileController;
import fileControllers.UserFileController;
import models.Message;
import models.User;

@Path("/message")
public class MessageController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/send")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String send(Message message) throws FileNotFoundException, IOException{
		ArrayList<User> users = UserFileController.readUser(config);
		ArrayList<Message> messages = MessageFileController.readMessage(config);
		
		for (User user : users) {
			if(user.getUsername().equals(message.getReceiver())){
				messages.add(message);
				MessageFileController.writeMessage(config, messages);
				return "Poruka poslata";
			}
		}
		return "Niste dobro uneli korisnicko ime primaoca";
	}
	
	@POST
	@Path("/read")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String read(Message message) throws FileNotFoundException, IOException{
		ArrayList<Message> messages = MessageFileController.readMessage(config);
		for (Message messageSaved : messages) {
			if((messageSaved.getSender().equals(message.getSender())) && (messageSaved.getContent().equals(message.getContent()))){
				messageSaved.setRead(true);
			}
		}
		MessageFileController.writeMessage(config, messages);
		return "procitana";
	}
	
	@GET
	@Path("/inbox/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Message> inbox(@PathParam(value = "username") String username) throws FileNotFoundException, IOException{
		ArrayList<Message> allMessages = MessageFileController.readMessage(config);
		ArrayList<Message> newMessages = new ArrayList<>();
		
		for (Message message : allMessages) {
			if(message.getReceiver().equals(username)){
				newMessages.add(message);
			}
		}
		return newMessages;
	}
}
