
package com.campusops.entities;

import java.time.LocalDateTime;
import jakarta.persistence.*;
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;

    @Column(unique = true, nullable = false)
    private String email;   // ✅ NEW FIELD

    private String uname;
    private String pwd;
    private String role;
    private String phone;
    private String gender;
    private String address;
    private Integer staffid;
    private LocalDateTime createdon;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public User() {
        this.createdon = LocalDateTime.now();
    }

    // ✅ ADD GETTER & SETTER

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	public int getUserid() {
		return userid;
	}

	public void setUserid(int userid) {
		this.userid = userid;
	}

	public String getUname() {
		return uname;
	}

	public void setUname(String uname) {
		this.uname = uname;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Integer getStaffid() {
		return staffid;
	}

	public void setStaffid(Integer staffid) {
		this.staffid = staffid;
	}

	public LocalDateTime getCreatedon() {
		return createdon;
	}

	public void setCreatedon(LocalDateTime createdon) {
		this.createdon = createdon;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	@Override
	public String toString() {
		return "User [userid=" + userid + ", email=" + email + ", uname=" + uname + ", pwd=" + pwd + ", role=" + role
				+ ", phone=" + phone + ", gender=" + gender + ", address=" + address + ", staffid=" + staffid
				+ ", createdon=" + createdon + ", course=" + course + "]";
	}

    
}

