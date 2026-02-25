package com.campusops.models;

import java.util.Map;

public class SubmitFeedbackDTO {
    public int studentId;
    public String comments;
    public Map<Integer,Integer> answers; // questionId -> 1..4
}
