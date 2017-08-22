package fileControllers;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import models.Message;

public class MessageFileController {

	public MessageFileController() {
		
	}
	
	public static ArrayList<Message> readMessage(ServletConfig config)throws FileNotFoundException, IOException{
		ArrayList<Message> messages = new ArrayList<Message>();
		String path = FilePaths.getPath(config).getPath();
		ObjectMapper mapper = new ObjectMapper();
		
		File varTmpDir = new File(path+"//Message.txt");
		boolean exists = varTmpDir.exists();
		if(!exists){
			try {
				PrintWriter wr = new PrintWriter(path+"//Message.txt");
				wr.close();
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
		}
		
		
		FileInputStream fis = new FileInputStream(new File(path+"//Message.txt"));
		
		JsonFactory jf = new JsonFactory();
	    JsonParser jp = jf.createParser(fis);
	    jp.setCodec(mapper);
	    jp.nextToken();
	    
	    while(jp.hasCurrentToken()){
	    	Message message = jp.readValueAs(Message.class);
	    	messages.add(message);
	    	jp.nextToken();
	    }
		
		return messages;
	}
	
	
	public static synchronized void writeMessage(ServletConfig config, ArrayList<Message> messages) {

		String path = FilePaths.getPath(config).getPath();
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		
		try {
			PrintWriter wr = new PrintWriter(path+"//Message.txt");
			wr.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		
		for (Message message : messages) {
			try {
				String s = ow.writeValueAsString(message);

				BufferedWriter writer = null;
				try {
					writer = new BufferedWriter(new FileWriter(path + "//Message.txt", true));
					writer.write(s);
					writer.newLine();
					writer.close();
				} catch (Exception e) {
					Response.status(Status.INTERNAL_SERVER_ERROR).build();
				}

			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
		}
		
	}
}
