package models;

import java.util.ArrayList;

public class Comment {

	private Theme theme;
	private String author;
	private String creatingDate;
	private Comment parent;
	private ArrayList<Comment> children = new ArrayList<Comment>();
	private String text;
	private int likes;
	private int dislikes;
	private boolean changed;
	private boolean deleted;
	private ArrayList<String> usersLiked = new ArrayList<String>();
	private ArrayList<String> usersDisliked = new ArrayList<String>();
	
	public Comment() {
		super();
	}
	
	public Comment(Theme theme, String author, String creatingDate, Comment parent, ArrayList<Comment> children,
			String text, int likes, int dislikes, boolean changed, boolean deleted) {
		super();
		this.theme = theme;
		this.author = author;
		this.creatingDate = creatingDate;
		this.parent = parent;
		this.children = children;
		this.text = text;
		this.likes = likes;
		this.dislikes = dislikes;
		this.changed = changed;
		this.deleted = deleted;
	}

	public Theme getTheme() {
		return theme;
	}

	public void setTheme(Theme theme) {
		this.theme = theme;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getCreatingDate() {
		return creatingDate;
	}

	public void setCreatingDate(String creatingDate) {
		this.creatingDate = creatingDate;
	}

	public Comment getParent() {
		return parent;
	}

	public void setParent(Comment parent) {
		this.parent = parent;
	}

	public ArrayList<Comment> getChildren() {
		return children;
	}

	public void setChildren(ArrayList<Comment> children) {
		this.children = children;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getLikes() {
		return likes;
	}

	public void setLikes(int likes) {
		this.likes = likes;
	}

	public int getDislikes() {
		return dislikes;
	}

	public void setDislikes(int dislikes) {
		this.dislikes = dislikes;
	}

	public boolean isChanged() {
		return changed;
	}

	public void setChanged(boolean changed) {
		this.changed = changed;
	}
	
	public ArrayList<String> getUsersLiked() {
		return usersLiked;
	}

	public void setUsersLiked(ArrayList<String> usersLiked) {
		this.usersLiked = usersLiked;
	}

	public void addUserLiked(String username) {
		if(usersLiked == null){
			usersLiked = new ArrayList<String>();
			usersLiked.add(username);
		}else{
			usersLiked.add(username);
		}
	}
	
	public void removeUserLiked(String username){
		usersLiked.remove(username);
	}
	
	public ArrayList<String> getUsersDisliked() {
		return usersDisliked;
	}

	public void setUsersDisliked(ArrayList<String> usersDisliked) {
		this.usersDisliked = usersDisliked;
	}
	
	public void addUserDisliked(String username) {
		if(usersDisliked == null){
			usersDisliked = new ArrayList<String>();
			usersDisliked.add(username);
		}else{
			usersDisliked.add(username);
		}
	}
	
	public void removeUserDisliked(String username){
		usersDisliked.remove(username);
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
}
