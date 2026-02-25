package com.campusops.models;

public class TaskDTO {
	  
	   private Integer course_id;
       private Integer module_id;
       private Integer staff_id;
        private String startDate;
        private String endDate;
		
        public int getCourse_id() {
			return course_id;
		}
		public void setCourse_id(int course_id) {
			this.course_id = course_id;
		}
		public int getModule_id() {
			return module_id;
		}
		public void setModule_id(int module_id) {
			this.module_id = module_id;
		}
		public int getStaff_id() {
			return staff_id;
		}
		public void setStaff_id(int staff_id) {
			this.staff_id = staff_id;
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
			return "TaskDTO [course_id=" + course_id + ", module_id=" + module_id + ", staff_id=" + staff_id
					+ ", startDate=" + startDate + ", endDate=" + endDate + "]";
		}
		
	

}
