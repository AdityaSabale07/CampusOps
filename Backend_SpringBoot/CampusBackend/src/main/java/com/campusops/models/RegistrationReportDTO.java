package com.campusops.models;

public class RegistrationReportDTO {

    private long totalRegistrations;
    private double totalRevenue;
    private double totalDiscount;
    private double averageFee;

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getTotalDiscount() {
        return totalDiscount;
    }

    public void setTotalDiscount(double totalDiscount) {
        this.totalDiscount = totalDiscount;
    }

    public double getAverageFee() {
        return averageFee;
    }

    public void setAverageFee(double averageFee) {
        this.averageFee = averageFee;
    }
}