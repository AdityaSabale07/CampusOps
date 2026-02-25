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


import com.campusops.models.TaskDTO;

import com.campusops.services.TaskService;

@CrossOrigin
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	@Autowired private TaskService task;
	
	@PostMapping("/validate")
	public ResponseEntity<?> save(@RequestBody TaskDTO dto) {	
		System.out.println("inside save........................................................"+dto);
		task.saveTask(dto);
		System.out.println(dto);
		return ResponseEntity.ok("Task registered successfully");
	}
	
	@GetMapping
	public ResponseEntity<?> findAll() {	
	System.out.println(task.listall());
		return ResponseEntity.ok(task.listall());
	}
	
	@GetMapping("course/{id}")
	
	public ResponseEntity<?> findAll(@PathVariable("id") int id) {		
		return ResponseEntity.ok(task.listByCourse(id));
	}
	
	@GetMapping("staff/{id}")
	public ResponseEntity<?> findAllStaff(@PathVariable("id") int id) {		
		return ResponseEntity.ok(task.listByStaff(id));
	}
	//Rename methode name if not working
	@GetMapping("module/{id}")
	public ResponseEntity<?> findAllModule(@PathVariable("id") int id) {		
		return ResponseEntity.ok(task.listByModule(id));
	}
	
	
	@GetMapping("{id}")
	public ResponseEntity<?> findById(@PathVariable("id") int id) {		
		return ResponseEntity.ok(task.findById(id));
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity<?> deleteById(@PathVariable("id") int id) {
		task.deleteTask(id);
		return ResponseEntity.ok("Deleted successfully");
	}
}
