package com.campusops.models;

public class LogsDTO {

    private Integer module_id;
    private Integer course_id;
    private Integer staff_id;

    private String date;
    private String group_name;
    private String startTime;
    private String endTime;

    private String assignmentGiven;
    private String studentProgress;

    // ================= GETTERS & SETTERS =================

    public Integer getModule_id() {
        return module_id;
    }

    public void setModule_id(Integer module_id) {
        this.module_id = module_id;
    }

    public Integer getCourse_id() {
        return course_id;
    }

    public void setCourse_id(Integer course_id) {
        this.course_id = course_id;
    }

    public Integer getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(Integer staff_id) {
        this.staff_id = staff_id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getAssignmentGiven() {
        return assignmentGiven;
    }

    public void setAssignmentGiven(String assignmentGiven) {
        this.assignmentGiven = assignmentGiven;
    }

    


    public String getStudentProgress() {
		return studentProgress;
	}

	public void setStudentProgress(String studentProgress) {
		this.studentProgress = studentProgress;
	}

	@Override
    public String toString() {
        return "LogsDTO [module_id=" + module_id +
                ", course_id=" + course_id +
                ", staff_id=" + staff_id +
                ", date=" + date +
                ", group_name=" + group_name +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", assignmentGiven=" + assignmentGiven +
                ", studentProgress=" + studentProgress + "]";
    }
}
