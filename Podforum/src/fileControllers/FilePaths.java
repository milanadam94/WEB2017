package fileControllers;

import java.io.File;

import javax.servlet.ServletConfig;

public class FilePaths {

	public static File getPath(ServletConfig config){
		File file = new File(config.getServletContext().getRealPath(""));
		File pathDatabase = new File(file.getParent()+"//DataBase");
		if(!pathDatabase.exists()){
			pathDatabase.mkdir();
		}
		return pathDatabase;
	}
}
