package com.campusops.models;

import java.time.LocalDate;

public class DiscountDTO {

    private int id;
    private String name;
    private String type;
    private double value;
    private String mode;
    private LocalDate startDate;
    private LocalDate endDate;

    // ===== Constructors =====

    public DiscountDTO() {}

    public DiscountDTO(int id, String name, String type,
                       double value,
                       LocalDate startDate,
                       LocalDate endDate) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // ===== Getters & Setters =====

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}