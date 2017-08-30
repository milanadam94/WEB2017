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

import models.Theme;

public class ThemeFileController {

	public ThemeFileController() {
		
	}
	
	public static ArrayList<Theme> readTheme(ServletConfig config)throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = new ArrayList<Theme>();
		String path = FilePaths.getPath(config).getPath();
		ObjectMapper mapper = new ObjectMapper();
		
		File varTmpDir = new File(path+"//Theme.txt");
		boolean exists = varTmpDir.exists();
		if(!exists){
			try {
				PrintWriter wr = new PrintWriter(path+"//Theme.txt");
				wr.close();
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
		}
		
		
		FileInputStream fis = new FileInputStream(new File(path+"//Theme.txt"));
		
		JsonFactory jf = new JsonFactory();
	    JsonParser jp = jf.createParser(fis);
	    jp.setCodec(mapper);
	    jp.nextToken();
	    
	    while(jp.hasCurrentToken()){
	    	Theme theme = jp.readValueAs(Theme.class);
	    	themes.add(theme);
	    	jp.nextToken();
	    }
		
		return themes;
	}
	
	
	public static synchronized void writeTheme(ServletConfig config, ArrayList<Theme> themes) {

		String path = FilePaths.getPath(config).getPath();
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		
		try {
			PrintWriter wr = new PrintWriter(path+"//Theme.txt");
			wr.close();
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		
		for (Theme theme : themes) {
			try {
				String s = ow.writeValueAsString(theme);

				BufferedWriter writer = null;
				try {
					writer = new BufferedWriter(new FileWriter(path + "//Theme.txt", true));
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
