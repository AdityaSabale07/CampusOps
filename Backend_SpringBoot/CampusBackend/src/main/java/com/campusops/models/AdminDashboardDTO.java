package com.campusops.models;

import java.util.List;

public class AdminDashboardDTO {

    private long totalRegistrations;
    private long approved;
    private long pending;
    private long rejected;

    private double totalRevenue;
    private double totalDiscount;

    private List<CourseAnalyticsDTO> courseAnalytics;
    private List<BatchReportDTO> batchAnalytics;

    // ===== GETTERS & SETTERS =====

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getApproved() {
        return approved;
    }

    public void setApproved(long approved) {
        this.approved = approved;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
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

    public List<CourseAnalyticsDTO> getCourseAnalytics() {
        return courseAnalytics;
    }

    public void setCourseAnalytics(
            List<CourseAnalyticsDTO> courseAnalytics) {
        this.courseAnalytics = courseAnalytics;
    }

    public List<BatchReportDTO> getBatchAnalytics() {
        return batchAnalytics;
    }

    public void setBatchAnalytics(
            List<BatchReportDTO> batchAnalytics) {
        this.batchAnalytics = batchAnalytics;
    }
}