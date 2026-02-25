package com.campusops.daos;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.ScheduledFeedback;
@Repository
public interface ScheduledFeedbackRepository extends JpaRepository<ScheduledFeedback,Integer>{
    List<ScheduledFeedback> findByStatus(String status);
    List<ScheduledFeedback> findByCourseIdAndStatus(int courseId, String status);
    List<ScheduledFeedback> findByStaffUseridAndStatus(int userid, String status);


}
