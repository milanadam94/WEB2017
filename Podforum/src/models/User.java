package models;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User {

	private String username;
	private String password;
	private String name;
	private String surname;
	private Role role;
	private String email;
	private String phoneNumber;
	private String registrationDate;
	
	private ArrayList<Subforum> subforums = new ArrayList<Subforum>();
	private ArrayList<Theme> themes = new ArrayList<Theme>();
	private ArrayList<Comment> comments = new ArrayList<Comment>();
	
	public User() {
	
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getRegistrationDate() {
		return registrationDate;
	}
	public void setRegistrationDate(String registrationDate) {
		this.registrationDate = registrationDate;
	}

	public ArrayList<Subforum> getSubforums() {
		return subforums;
	}

	public void setSubforums(ArrayList<Subforum> subforums) {
		this.subforums = subforums;
	}

	public void addSubforum(Subforum subforum){
		if(subforums == null){
			this.subforums = new ArrayList<Subforum>();
			subforums.add(subforum);
		}else{
			this.subforums.add(subforum);
		}
	}
	
	public void removeSubforum(Subforum subforum){
		this.subforums.remove(subforum);
	}
	
	public ArrayList<Theme> getThemes() {
		return themes;
	}

	public void setThemes(ArrayList<Theme> themes) {
		this.themes = themes;
	}

	public ArrayList<Comment> getComments() {
		return comments;
	}

	public void setComments(ArrayList<Comment> comments) {
		this.comments = comments;
	}
	
	
}
