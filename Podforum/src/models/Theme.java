package models;

import java.util.ArrayList;

public class Theme {

	private Subforum subforum;
	private String name;
	private ThemeType type;
	private String author;
	private ArrayList<Comment> comments = new ArrayList<Comment>();
	private String content;
	private String creatingDate;
	private int likes;
	private int dislikes;
	private ArrayList<String> usersLiked = new ArrayList<String>();
	private ArrayList<String> usersDisliked = new ArrayList<String>();
	
	public Theme() {
		super();
	}

	
	public Theme(Subforum subforum, String name, ThemeType type, String author, String content, String creatingDate,
			int likes, int dislikes) {
		super();
		this.subforum = subforum;
		this.name = name;
		this.type = type;
		this.author = author;
		this.content = content;
		this.creatingDate = creatingDate;
		this.likes = likes;
		this.dislikes = dislikes;
	}


	public Subforum getSubforum() {
		return subforum;
	}

	public void setSubforum(Subforum subforum) {
		this.subforum = subforum;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ThemeType getType() {
		return type;
	}

	public void setType(ThemeType type) {
		this.type = type;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public ArrayList<Comment> getComments() {
		return comments;
	}

	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}

	public void addComment(Comment comment){
		if(comments == null){
			this.comments = new ArrayList<Comment>();
			this.comments.add(comment);
		}else{
			this.comments.add(comment);
		}
	}
	
	public void removeComment(Comment comment){
		comments.remove(comment);
	}
	
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreatingDate() {
		return creatingDate;
	}

	public void setCreatingDate(String creatingDate) {
		this.creatingDate = creatingDate;
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
}
