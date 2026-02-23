package com.campusops.entities;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;



@Entity
@Table(
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"template_id", "questionText"}
    )
)

public class TemplateQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String questionText;

    @ManyToOne
    @JoinColumn(name = "template_id")
    @JsonBackReference
    private FeedbackTemplate template;


    // ================= GETTERS & SETTERS =================

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public FeedbackTemplate getTemplate() {
        return template;
    }

    public void setTemplate(FeedbackTemplate template) {
        this.template = template;
    }

	
    
    
}
