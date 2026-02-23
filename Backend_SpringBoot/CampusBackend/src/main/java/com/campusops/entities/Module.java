package com.campusops.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;



@Entity
public class Module {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String description;
	private double theoryhr;
	private double practicalhr;
	@ManyToOne
	@JoinColumn(name="course_id")
	private Course course;
	
	private LocalDateTime createdon;
	public Module() {
		this.createdon=LocalDateTime.now();
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public double getTheoryhr() {
		return theoryhr;
	}
	public void setTheoryhr(double theoryhr) {
		this.theoryhr = theoryhr;
	}
	public double getPracticalhr() {
		return practicalhr;
	}
	public void setPracticalhr(double practicalhr) {
		this.practicalhr = practicalhr;
	}
	public Course getCourse() {
		return course;
	}
	public void setCourse(Course course) {
		this.course = course;
	}
	public LocalDateTime getCreatedon() {
		return createdon;
	}
	public void setCreatedon(LocalDateTime createdon) {
		this.createdon = createdon;
	}
	@Override
	public String toString() {
		return "Module [id=" + id + ", Description=" + description + ", theoryhr=" + theoryhr + ", practicalhr="
				+ practicalhr  + ", course=" + course + ", createdon=" + createdon
				+ "]";
	}
	
	
	

}