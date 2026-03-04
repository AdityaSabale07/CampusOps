package com.campusops.models;

import java.time.LocalDate;

public class AdmissionStatusDTO {

    private int id;
    private String studentName;
    private String email;
    private String status;

    private String batchName;
    private String courseName;

    // ⭐ NEW FEE FIELDS (ADDED)
    private double originalFee;
    private double discountAmount;
    private double finalAmount;

    private String tempPassword;

    // ⭐ REGISTRATION
    private String registrationId;

    // ⭐ DISCOUNT
    private String discountName;
    private String discountType;

    // ⭐ PAYMENT
    private String paymentStatus;
    private LocalDate paymentDueDate;

    // ===== GETTERS & SETTERS =====

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBatchName() {
        return batchName;
    }

    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    // ===== FEES =====

    public double getOriginalFee() {
        return originalFee;
    }

    public void setOriginalFee(double originalFee) {
        this.originalFee = originalFee;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    // ===== TEMP PASSWORD =====

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }

    // ===== REGISTRATION =====

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    // ===== DISCOUNT =====

    public String getDiscountName() {
        return discountName;
    }

    public void setDiscountName(String discountName) {
        this.discountName = discountName;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    // ===== PAYMENT =====

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getPaymentDueDate() {
        return paymentDueDate;
    }

    public void setPaymentDueDate(LocalDate paymentDueDate) {
        this.paymentDueDate = paymentDueDate;
    }
}