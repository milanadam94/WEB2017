package models;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Message {

	private String sender;
	private String receiver;
	private String content;
	private boolean read;
	
	private Message() {
		
	}
	
	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean isRead) {
		this.read = isRead;
	}
	
	
}
