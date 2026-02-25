package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.campusops.entities.Task;
import com.campusops.entities.User;
import com.campusops.entities.Course;
import com.campusops.entities.Module;


@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

	public List<Task> findByCourse(Course findById);
	public List<Task> findByStaff(User findById);
	public List<Task> findByModule(Module findById);

}
