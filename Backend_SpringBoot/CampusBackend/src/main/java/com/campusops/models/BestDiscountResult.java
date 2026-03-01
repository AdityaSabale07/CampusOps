package com.campusops.models;

public class BestDiscountResult {

    private int discountId;
    private String discountName;
    private String discountType;
    private double amount;

    public BestDiscountResult() {}

    public BestDiscountResult(int discountId,
                              String discountName,
                              String discountType,
                              double amount) {
        this.discountId = discountId;
        this.discountName = discountName;
        this.discountType = discountType;
        this.amount = amount;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}