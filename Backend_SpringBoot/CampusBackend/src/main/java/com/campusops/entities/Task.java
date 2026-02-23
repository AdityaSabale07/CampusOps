package com.campusops.entities;

import jakarta.persistence.*;

@Entity
public class Task {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
	    
	    @ManyToOne
	    @JoinColumn(name = "module_id")
	    private Module module;

	    @ManyToOne
	    @JoinColumn(name = "course_id")
	    private Course course;

	    @ManyToOne
	    @JoinColumn(name = "staff_id")
	    private User staff;

	   // @Temporal(TemporalType.DATE)
	    private String startDate;

//	    @Temporal(TemporalType.DATE)
	    private String endDate;

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

		public String getStartDate() {
			return startDate;
		}

		public void setStartDate(String startDate) {
			this.startDate = startDate;
		}

		public String getEndDate() {
			return endDate;
		}

		public void setEndDate(String endDate) {
			this.endDate = endDate;
		}

		@Override
		public String toString() {
			return "Task [id=" + id + ", module=" + module + ", course=" + course + ", staff=" + staff + ", startDate="
					+ startDate + ", endDate=" + endDate + "]";
		}
	
}
