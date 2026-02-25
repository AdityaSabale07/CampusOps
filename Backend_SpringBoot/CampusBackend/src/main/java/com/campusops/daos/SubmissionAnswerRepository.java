package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.SubmissionAnswer;

@Repository
public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer,Integer>{
    List<SubmissionAnswer> findBySubmissionScheduledFeedbackId(Integer scheduleId);
}
