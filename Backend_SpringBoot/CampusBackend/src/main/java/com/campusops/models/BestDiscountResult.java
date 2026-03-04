package com.campusops.models;

import java.time.LocalDate;

public class BestDiscountResult {

    private int discountId;
    private String discountName;
    private String discountType;

    // 🔥 original discount value (20 or 2000)
    private double value;

    // 🔥 PERCENTAGE or FLAT
    private String mode;

    // 🔥 calculated amount in ₹
    private double amount;

    // 🔥 validity dates
    private LocalDate startDate;
    private LocalDate endDate;

    public BestDiscountResult() {}

    public BestDiscountResult(int discountId,
                              String discountName,
                              String discountType,
                              double value,
                              String mode,
                              double amount,
                              LocalDate startDate,
                              LocalDate endDate) {
        this.discountId = discountId;
        this.discountName = discountName;
        this.discountType = discountType;
        this.value = value;
        this.mode = mode;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public int getDiscountId() {
        return discountId;
    }

    public void setDiscountId(int discountId) {
        this.discountId = discountId;
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

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
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