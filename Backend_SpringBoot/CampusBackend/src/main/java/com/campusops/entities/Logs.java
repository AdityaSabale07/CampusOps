package com.campusops.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "logs")
public class Logs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // ================= RELATIONS =================

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff;

    // Router who verified
    @ManyToOne
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    // Admin who approved
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    // ================= LOG DETAILS =================

    private String date;
    private String group_name;
    private String startTime;
    private String endTime;

    private String assignmentGiven;
    private String studentProgress;

    // ================= STATUS =================

    @Enumerated(EnumType.STRING)
    private LogStatus status;

    private LocalDateTime verifiedOn;
    private LocalDateTime approvedOn;

    private LocalDateTime createdOn;
    @Column(length = 300)
    private String routerRemark;

    @Column(length = 300)
    private String adminRemark;



    // ================= CONSTRUCTOR =================

    public Logs() {
        this.createdOn = LocalDateTime.now();
        this.status = LogStatus.PENDING;
    }


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Module getModule() {
		return module;
	}


	public void setModule(Module module) {
		this.module = module;
	}


	public Course getCourse() {
		return course;
	}


	public void setCourse(Course course) {
		this.course = course;
	}


	public User getStaff() {
		return staff;
	}


	public void setStaff(User staff) {
		this.staff = staff;
	}


	public User getVerifiedBy() {
		return verifiedBy;
	}


	public void setVerifiedBy(User verifiedBy) {
		this.verifiedBy = verifiedBy;
	}


	public User getApprovedBy() {
		return approvedBy;
	}


	public void setApprovedBy(User approvedBy) {
		this.approvedBy = approvedBy;
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


	public LogStatus getStatus() {
		return status;
	}


	public void setStatus(LogStatus status) {
		this.status = status;
	}


	public LocalDateTime getVerifiedOn() {
		return verifiedOn;
	}


	public void setVerifiedOn(LocalDateTime verifiedOn) {
		this.verifiedOn = verifiedOn;
	}


	public LocalDateTime getApprovedOn() {
		return approvedOn;
	}


	public void setApprovedOn(LocalDateTime approvedOn) {
		this.approvedOn = approvedOn;
	}


	public LocalDateTime getCreatedOn() {
		return createdOn;
	}


	public void setCreatedOn(LocalDateTime createdOn) {
		this.createdOn = createdOn;
	}


	public String getRouterRemark() {
		return routerRemark;
	}


	public void setRouterRemark(String routerRemark) {
		this.routerRemark = routerRemark;
	}


	public String getAdminRemark() {
		return adminRemark;
	}


	public void setAdminRemark(String adminRemark) {
		this.adminRemark = adminRemark;
	}


	@Override
	public String toString() {
		return "Logs [id=" + id + ", module=" + module + ", course=" + course + ", staff=" + staff + ", verifiedBy="
				+ verifiedBy + ", approvedBy=" + approvedBy + ", date=" + date + ", group_name=" + group_name
				+ ", startTime=" + startTime + ", endTime=" + endTime + ", assignmentGiven=" + assignmentGiven
				+ ", studentProgress=" + studentProgress + ", status=" + status + ", verifiedOn=" + verifiedOn
				+ ", approvedOn=" + approvedOn + ", createdOn=" + createdOn + ", routerRemark=" + routerRemark
				+ ", adminRemark=" + adminRemark + "]";
	}

    // ================= GETTERS & SETTERS =================

    
}
