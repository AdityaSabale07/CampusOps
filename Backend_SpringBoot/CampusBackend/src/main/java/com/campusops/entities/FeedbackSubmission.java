package com.campusops.entities;

import jakarta.persistence.*;

@Entity
public class FeedbackSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int studentId;

    @Column(length = 500)
    private String comments;

    @ManyToOne
    private ScheduledFeedback scheduledFeedback;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getStudentId() {
		return studentId;
	}

	public void setStudentId(int studentId) {
		this.studentId = studentId;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public ScheduledFeedback getScheduledFeedback() {
		return scheduledFeedback;
	}

	public void setScheduledFeedback(ScheduledFeedback scheduledFeedback) {
		this.scheduledFeedback = scheduledFeedback;
	}

	@Override
	public String toString() {
		return "FeedbackSubmission [id=" + id + ", studentId=" + studentId + ", comments=" + comments
				+ ", scheduledFeedback=" + scheduledFeedback + "]";
	}

    // getters/setters
}
