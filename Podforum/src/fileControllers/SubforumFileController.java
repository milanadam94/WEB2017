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

import models.Subforum;

public class SubforumFileController {

	public SubforumFileController() {
		
	}
	
	public static ArrayList<Subforum> readSubforum(ServletConfig config)throws FileNotFoundException, IOException{
		ArrayList<Subforum> subforums = new ArrayList<Subforum>();
		String path = FilePaths.getPath(config).getPath();
		ObjectMapper mapper = new ObjectMapper();
		
		File varTmpDir = new File(path+"//Subforum.json");
		boolean exists = varTmpDir.exists();
		if(!exists){
			try {
				PrintWriter wr = new PrintWriter(path+"//Subforum.json");
				wr.close();
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
		}
		
		
		FileInputStream fis = new FileInputStream(new File(path+"//Subforum.json"));
		
		JsonFactory jf = new JsonFactory();
	    JsonParser jp = jf.createParser(fis);
	    jp.setCodec(mapper);
	    jp.nextToken();
	    
	    while(jp.hasCurrentToken()){
	    	Subforum subforum = jp.readValueAs(Subforum.class);
	    	subforums.add(subforum);
	    	jp.nextToken();
	    }
		
		return subforums;
	}
	
	
	public static synchronized void writeSubforum(ServletConfig config, ArrayList<Subforum> subforums) {

		String path = FilePaths.getPath(config).getPath();
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		
		try {
			PrintWriter wr = new PrintWriter(path+"//Subforum.json");
			wr.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		
		for (Subforum subforum : subforums) {
			try {
				String s = ow.writeValueAsString(subforum);

				BufferedWriter writer = null;
				try {
					writer = new BufferedWriter(new FileWriter(path + "//Subforum.json", true));
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
