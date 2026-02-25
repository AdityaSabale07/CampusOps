package com.campusops.models;

import java.util.List;

public class ReportDTO {

    public double finalAverage;
    public int totalFeedback;

    // 🔥 ADD THESE
    public String staffName;
    public String courseName;
    public String moduleName;
    public String templateName;

    public List<QuestionReportDTO> questions;
}
