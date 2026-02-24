package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.Course;
import com.campusops.entities.LogStatus;
import com.campusops.entities.Logs;
import com.campusops.entities.Module;
import com.campusops.entities.User;

@Repository
public interface LogsRepository extends JpaRepository<Logs, Integer> {

    // Find logs by course
    List<Logs> findByCourse(Course course);

    // Find logs by module
    List<Logs> findByModule(Module module);

    // Find logs by status (ENUM now)
    List<Logs> findByStatus(LogStatus status);

    // Find logs by staff
    List<Logs> findByStaff(User staff);

    // Find logs by course AND status (for router)
    List<Logs> findByCourseAndStatus(Course course, LogStatus status);
}
