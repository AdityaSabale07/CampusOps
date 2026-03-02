package com.campusops.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class ModularBatchRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // ================= STUDENT INFO =================

    private String studentName;

    private String email;   // student identifier

    private String phone;

    // ================= REGISTRATION INFO =================

    @Column(unique = true)
    private String registrationId;

    private LocalDateTime registeredOn;

    // ================= PAYMENT INFO =================

    private double originalFee;

    private double discountAmount;

    private double finalAmount;
 // ================= DISCOUNT INFO =================

    private String discountName;
    private String discountType;

    // ================= STATUS =================

    private String status;
    // PENDING / APPROVED / REJECTED

    // ================= LOGIN INFO (NEW SAFE FIELD) =================

    private String tempPassword;
    // shown to student after approval
    
    private String paymentStatus;
    private String paymentId;
    private LocalDateTime paymentDate;
    private LocalDate paymentDueDate;

    // ================= RELATION =================

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    // ================= CONSTRUCTOR =================

    public ModularBatchRegistration() {
        this.registeredOn = LocalDateTime.now();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }

    // ================= GETTERS & SETTERS =================

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    public LocalDateTime getRegisteredOn() {
        return registeredOn;
    }

    public void setRegisteredOn(LocalDateTime registeredOn) {
        this.registeredOn = registeredOn;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Batch getBatch() {
        return batch;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    // ================= NEW GETTERS =================

    public String getTempPassword() {
        return tempPassword;
    }

    public void setTempPassword(String tempPassword) {
        this.tempPassword = tempPassword;
    }
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
 // ================= PAYMENT GETTERS =================

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public LocalDate getPaymentDueDate() {
        return paymentDueDate;
    }

    public void setPaymentDueDate(LocalDate paymentDueDate) {
        this.paymentDueDate = paymentDueDate;
    }
}