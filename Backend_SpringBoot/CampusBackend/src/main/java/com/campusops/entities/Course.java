package com.campusops.entities;

import java.util.List;

import jakarta.persistence.*;

//import javax.persistence.CascadeType;
//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//import javax.persistence.OneToMany;

@Entity
public class Course {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String coursename;
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
	private List<User> staffs;
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
	private List<Batch> batches;
	
	 @Enumerated(EnumType.STRING)
	    private CourseType courseType;

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCoursename() {
		return coursename;
	}
	public void setCoursename(String coursename) {
		this.coursename = coursename;
	}
	
	 public CourseType getCourseType() {
	        return courseType;
	    }

	    public void setCourseType(CourseType courseType) {
	        this.courseType = courseType;
	    }
	@Override
	public String toString() {
		return "Course [id=" + id + ", coursename=" + coursename + ", courseType=" + courseType + "]";
	}
	
	
}