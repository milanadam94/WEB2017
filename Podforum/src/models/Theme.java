package models;

import java.util.ArrayList;

public class Theme {

	private Subforum subforum;
	private String name;
	private ThemeType type;
	private User author;
	private ArrayList<Comment> comments;
	private String content;
	private String creatingDate;
	private int likes;
	private int dislikes;
	
	public Theme() {
		super();
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

	public User getAuthor() {
		return author;
	}

	public void setAuthor(User author) {
		this.author = author;
	}

	public ArrayList<Comment> getComments() {
		return comments;
	}

	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
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
	
	
	
}
