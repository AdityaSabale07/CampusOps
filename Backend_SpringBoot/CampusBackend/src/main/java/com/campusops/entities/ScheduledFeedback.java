package com.campusops.entities;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
public class ScheduledFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status; // ACTIVE / CLOSED

    @ManyToOne
    @JoinColumn(name="template_id")
    private FeedbackTemplate template;

    @ManyToOne
    @JoinColumn(name="staff_userid")
    private User staff;


    // STEP 1: Course linkage
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // ✅ STEP 2: Module linkage
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    // ---------- getters & setters ----------

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public FeedbackTemplate getTemplate() {
        return template;
    }

    public void setTemplate(FeedbackTemplate template) {
        this.template = template;
    }

    public User getStaff() {
        return staff;
    }

    public void setStaff(User staff) {
        this.staff = staff;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    @Override
    public String toString() {
        return "ScheduledFeedback [id=" + id +
               ", startDate=" + startDate +
               ", endDate=" + endDate +
               ", status=" + status +
               ", template=" + template +
               ", staff=" + staff +
               ", course=" + course +
               ", module=" + module + "]";
    }
}
