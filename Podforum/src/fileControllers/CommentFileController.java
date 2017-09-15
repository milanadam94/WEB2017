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

import models.Comment;

public class CommentFileController {

	public CommentFileController() {
		
	}
	
	public static ArrayList<Comment> readComment(ServletConfig config)throws FileNotFoundException, IOException{
		ArrayList<Comment> comments = new ArrayList<Comment>();
		String path = FilePaths.getPath(config).getPath();
		ObjectMapper mapper = new ObjectMapper();
		
		File varTmpDir = new File(path+"//Comment.json");
		boolean exists = varTmpDir.exists();
		if(!exists){
			try {
				PrintWriter wr = new PrintWriter(path+"//Comment.json");
				wr.close();
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
		}
		
		
		FileInputStream fis = new FileInputStream(new File(path+"//Comment.json"));
		
		JsonFactory jf = new JsonFactory();
	    JsonParser jp = jf.createParser(fis);
	    jp.setCodec(mapper);
	    jp.nextToken();
	    
	    while(jp.hasCurrentToken()){
	    	Comment comment = jp.readValueAs(Comment.class);
	    	comments.add(comment);
	    	jp.nextToken();
	    }
		
		return comments;
	}
	
	
	public static synchronized void writeComment(ServletConfig config, ArrayList<Comment> comments) {

		String path = FilePaths.getPath(config).getPath();
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		
		try {
			PrintWriter wr = new PrintWriter(path+"//Comment.json");
			wr.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		
		for (Comment comment : comments) {
			try {
				String s = ow.writeValueAsString(comment);

				BufferedWriter writer = null;
				try {
					writer = new BufferedWriter(new FileWriter(path + "//Comment.json", true));
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
