package com.campusops.models;

public class LoginDTO {

    private String email;   // ✅ changed from userid
    private String pwd;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    @Override
    public String toString() {
        return "LoginDTO [email=" + email + "]";
    }
}
