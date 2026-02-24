package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.Course;
import com.campusops.entities.CourseType;



@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findByCourseType(CourseType type);

}
