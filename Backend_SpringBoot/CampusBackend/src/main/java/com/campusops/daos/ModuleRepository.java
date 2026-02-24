package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.Course;
import com.campusops.entities.Module;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {

	List<Module> findByCourse(Course course);
}
