package com.campusops.models;

public class ModuleDTO {
	private String description;
	private int course_id;
	private double theoryhr;
	private double practicalhr;
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getCourse_id() {
		return course_id;
	}
	public void setCourse_id(int course_id) {
		this.course_id = course_id;
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
	@Override
	public String toString() {
		return "ModuleDTO [description=" + description + ", course_id=" + course_id + ", theoryhr=" + theoryhr
				+ ", practicalhr=" + practicalhr + "]";
	}
	
	
	
	
}

