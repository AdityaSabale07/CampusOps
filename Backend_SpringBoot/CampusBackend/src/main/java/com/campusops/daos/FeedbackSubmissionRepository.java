package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.FeedbackSubmission;

@Repository
public interface FeedbackSubmissionRepository extends JpaRepository<FeedbackSubmission,Integer>{
    List<FeedbackSubmission> findByScheduledFeedbackId(Integer scheduleId);
    boolean existsByScheduledFeedbackIdAndStudentId(Integer scheduleId,Integer studentId);
}
