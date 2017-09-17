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

import fileControllers.CommentFileController;
import fileControllers.ThemeFileController;
import models.Comment;
import models.Theme;

@Path("/comment")
public class CommentController {

	@Context
	private ServletConfig config;
	
	@POST
	@Path("/addComment")
	@Consumes(MediaType.APPLICATION_JSON)
	public String addComment(Comment comment) throws FileNotFoundException, IOException{
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		
		Comment newComment = new Comment(comment.getTheme(), comment.getAuthor(), comment.getCreatingDate(), comment.getParent(),
				comment.getText(), comment.getLikes(), comment.getDislikes(), comment.isChanged(), comment.isDeleted());
		comments.add(newComment);
		CommentFileController.writeComment(config, comments);
		
		for(int i = 0; i < themes.size(); i++){
			if(themes.get(i).getName().equals(comment.getTheme().getName())){
				themes.get(i).addComment(newComment);
				break;
			}
		}
		ThemeFileController.writeTheme(config, themes);
		
		return "Prokomentarisana tema";
	}
	
	@POST
	@Path("/addSubcomment")
	@Consumes(MediaType.APPLICATION_JSON)
	public String addSubcomment(Comment comment) throws FileNotFoundException, IOException{
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		
		for(int i = 0; i < comments.size(); i++){
			if(comments.get(i).getText().equals(comment.getText())){
				comments.get(i).addChild(comment.getChildren().get(comment.getChildren().size() - 1));
				//comments.get(i).getChildren().add(comment.getChildren().get(comment.getChildren().size() - 1));
				break;
			}
		}
		CommentFileController.writeComment(config, comments);
		for(int i = 0; i < themes.size(); i++){
			ArrayList<Comment> commentsOfTheme = themes.get(i).getComments();
			for(int j = 0; j < commentsOfTheme.size(); j++){
				if(commentsOfTheme.get(j).getText().equals(comment.getText())){
					//commentsOfTheme.get(j).getChildren().add(comment.getChildren().get(comment.getChildren().size() - 1));
					commentsOfTheme.get(j).addChild(comment.getChildren().get(comment.getChildren().size() - 1));
					break;
				}
			}
		}
		ThemeFileController.writeTheme(config, themes);
		
		return "Odgovorili ste na komentar";
	}
	
	@GET
	@Path("/getComments/{themeName}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Comment> getComments(@PathParam(value = "themeName") String themeName) throws FileNotFoundException, IOException{
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		ArrayList<Comment> commentsOfTheme = new ArrayList<Comment>();
		for (Comment com : comments) {
			if(com.getTheme().getName().equals(themeName))
				commentsOfTheme.add(com);
		}
		return commentsOfTheme;
	}
	
	@POST
	@Path("/editComment/{oldCom}")
	@Consumes(MediaType.APPLICATION_JSON)
	public String editComment(@PathParam(value = "oldCom") String oldCom, Comment comment) throws FileNotFoundException, IOException{
		ArrayList<Comment> comments = CommentFileController.readComment(config);
		ArrayList<Theme> themes = ThemeFileController.readTheme(config);
		
		boolean isSubcomment = true;
		for(int i = 0; i < comments.size(); i++){
			if(comments.get(i).getText().equals(oldCom)){
				comments.get(i).setText(comment.getText());
				comments.get(i).setChanged(comment.isChanged());
				comments.get(i).setCreatingDate(comment.getCreatingDate());
				isSubcomment = false;
				break;
			}
		}
		if(isSubcomment){
			for(int i = 0; i < comments.size(); i++){
				ArrayList<Comment> children = comments.get(i).getChildren();
				for(int j = 0; j < children.size(); j++){
					if(children.get(j).getText().equals(oldCom)){
						children.get(j).setText(comment.getText());
						children.get(j).setChanged(comment.isChanged());
						children.get(j).setCreatingDate(comment.getCreatingDate());
						break;
					}
				}
			}
		}
		CommentFileController.writeComment(config, comments);
		
		for(int i = 0 ; i < themes.size(); i++){
			ArrayList<Comment> commentsOfTheme = themes.get(i).getComments();
			boolean isSubCom = true;
			for(int j = 0; j < commentsOfTheme.size(); j++){
				if(commentsOfTheme.get(j).getText().equals(oldCom)){
					commentsOfTheme.get(j).setText(comment.getText());
					commentsOfTheme.get(j).setChanged(comment.isChanged());
					commentsOfTheme.get(j).setCreatingDate(comment.getCreatingDate());
					isSubCom = false;
					break;
				}
			}
			if(isSubCom){
				ArrayList<Comment> children = commentsOfTheme.get(i).getChildren();
				for(int j = 0; j < children.size(); j++){
					if(children.get(j).getText().equals(oldCom)){
						children.get(j).setText(comment.getText());
						children.get(j).setChanged(comment.isChanged());
						children.get(j).setCreatingDate(comment.getCreatingDate());
						break;
					}
				}
			}
		}
		ThemeFileController.writeTheme(config, themes);
		return "Komentar izmenjen";
	}
}
