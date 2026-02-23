package com.campusops.entities;

import jakarta.persistence.*;

@Entity
public class SubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // 1–4 (from stars)
    private int rating;

    @ManyToOne
    private TemplateQuestion question;

    @ManyToOne
    private FeedbackSubmission submission;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public TemplateQuestion getQuestion() {
		return question;
	}

	public void setQuestion(TemplateQuestion question) {
		this.question = question;
	}

	public FeedbackSubmission getSubmission() {
		return submission;
	}

	public void setSubmission(FeedbackSubmission submission) {
		this.submission = submission;
	}

	@Override
	public String toString() {
		return "SubmissionAnswer [id=" + id + ", rating=" + rating + ", question=" + question + ", submission="
				+ submission + "]";
	}

    // getters/setters
}
