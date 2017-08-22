package models;

import java.util.ArrayList;

public class Subforum {

	private String name;
	private String description;
	private String iconPath;
	private ArrayList<String> rules;
	private User responibleModerator;
	private ArrayList<User> moderators;
	
	public Subforum() {
		super();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIconPath() {
		return iconPath;
	}

	public void setIconPath(String iconPath) {
		this.iconPath = iconPath;
	}

	public ArrayList<String> getRules() {
		return rules;
	}

	public void setRules(ArrayList<String> rules) {
		this.rules = rules;
	}

	public User getResponibleModerator() {
		return responibleModerator;
	}

	public void setResponibleModerator(User responibleModerator) {
		this.responibleModerator = responibleModerator;
	}

	public ArrayList<User> getModerators() {
		return moderators;
	}

	public void setModerators(ArrayList<User> moderators) {
		this.moderators = moderators;
	}
	
	
}
