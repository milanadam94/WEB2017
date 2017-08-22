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
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import fileControllers.SubforumFileController;
import fileControllers.UserFileController;
import models.Subforum;
import models.User;

@Path("/subforum")
public class SubforumController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/saveSubforum")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String saveSubforum(Subforum subforum) throws FileNotFoundException, IOException{
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		
		for (Subforum subforum2 : subforums) {
			if(subforum2.getName().equals(subforum.getName())){
				subforum2.setDescription(subforum.getDescription());
				subforum2.setResponibleModerator(subforum.getResponibleModerator());
				//subforums.add(subforum2);
				SubforumFileController.writeSubforum(config, subforums);
				return "Uspesno kreiran podforum";
			}
		}
		return "";
	}
	
	public File getMediaPath(String s){
		//File file = new File(s);
		File pathDatabase = new File(s);
		if(!pathDatabase.exists()){
			pathDatabase.mkdir();
		}
		return pathDatabase;
	}
	
	@POST
	@Path("uploadIcon/{subforumName}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public synchronized Response uploadIcon(@PathParam("subforumName") String subforumName,
			@FormDataParam("file") InputStream in, @FormDataParam("file") FormDataContentDisposition info) throws FileNotFoundException, IOException{
	
		String s = config.getServletContext().getRealPath("");
		String path = getMediaPath(s).getPath();
		ArrayList<Subforum> subforums = SubforumFileController.readSubforum(config);
		
		Subforum subforum = new Subforum(subforumName, null, null, null, null, null);
		subforums.add(subforum);
		SubforumFileController.writeSubforum(config, subforums);
	
		try {
			int read = 0;
			File file = new File(path + "//" + "icons" + "//" +info.getFileName());
			/*if(file.exists()){
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}*/
			for(Subforum sub : subforums){
				if(sub.getName().equals(subforumName)){
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
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		return Response.ok().build();
	}
}
