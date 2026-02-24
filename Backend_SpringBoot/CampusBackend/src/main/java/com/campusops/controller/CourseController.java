package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusops.entities.Course;
import com.campusops.services.CourseService;



@CrossOrigin
@RestController
@RequestMapping("/api/courses")
public class CourseController {
	
	@Autowired private CourseService cservice;
	
	@PostMapping
	public ResponseEntity<?> save(@RequestBody Course request) {		
		cservice.saveCourse(request);
		return ResponseEntity.ok("Course registered successfully");
	}
	
	@GetMapping
	public ResponseEntity<?> findAll() {		
		return ResponseEntity.ok(cservice.listall());
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity<?> deleteById(@PathVariable("id") int id) {
		cservice.deleteCourse(id);
		return ResponseEntity.ok("Deleted successfully");
	}
	@GetMapping("/modular")
	public ResponseEntity<?> getModularCourses() {
	    return ResponseEntity.ok(
	            cservice.getModularCourses());
	}

}
