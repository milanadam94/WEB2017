package models;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Subforum {

	private String name;
	private String description;
	private String iconPath;
	private String rules;
	private String responibleModerator;
	private ArrayList<User> moderators;
	
	public Subforum() {
		super();
	}

	public Subforum(String name, String description, String iconPath, String rules, String responibleModerator,
			ArrayList<User> moderators) {
		super();
		this.name = name;
		this.description = description;
		this.iconPath = iconPath;
		this.rules = rules;
		this.responibleModerator = responibleModerator;
		this.moderators = moderators;
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

	public String getRules() {
		return rules;
	}

	public void setRules(String rules) {
		this.rules = rules;
	}

	public String getResponibleModerator() {
		return responibleModerator;
	}

	public void setResponibleModerator(String responibleModerator) {
		this.responibleModerator = responibleModerator;
	}

	public ArrayList<User> getModerators() {
		return moderators;
	}

	public void setModerators(ArrayList<User> moderators) {
		this.moderators = moderators;
	}
	
	
}
