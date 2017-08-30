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

import fileControllers.ThemeFileController;
import models.Theme;

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
			if(t.getSubforum().equals(theme.getSubforum()))
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
	
	@GET
	@Path("/getThemes/{subforumName}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Theme> getThemes(@PathParam(value = "subforumName") String subforumName) throws FileNotFoundException, IOException{
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		ArrayList<Theme> themesOfSubforum = new ArrayList<Theme>();
		for (Theme t : themes) {
			if(t.getSubforum().equals(subforumName))
				themesOfSubforum.add(t);
		}
		return themesOfSubforum;
	}
}
