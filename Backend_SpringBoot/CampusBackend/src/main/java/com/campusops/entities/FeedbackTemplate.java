package com.campusops.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
public class FeedbackTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    // 🔒 NEW FIELD
    private boolean locked = false;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<TemplateQuestion> questions;


    // ================= GETTERS & SETTERS =================

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public List<TemplateQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<TemplateQuestion> questions) {
        this.questions = questions;
    }

	
    
}
