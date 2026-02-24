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

import com.campusops.models.ModuleDTO;
import com.campusops.services.ModuleService;

@CrossOrigin
@RestController
@RequestMapping("/api/modules")
public class ModuleController {

	@Autowired private ModuleService module;
	
	@PostMapping
	public ResponseEntity<?> save(@RequestBody ModuleDTO dto) {		
		module.saveModule(dto);
		System.out.println(dto);
		return ResponseEntity.ok("Module registered successfully");
	}
	
	@GetMapping
	public ResponseEntity<?> findAll() {	
	System.out.println(module.listall());
		return ResponseEntity.ok(module.listall());
	}
	
	@GetMapping("course/{id}")
	public ResponseEntity<?> findAll(@PathVariable("id") int id) {		
		return ResponseEntity.ok(module.listByCourse(id));
	}
	
	@GetMapping("{id}")
	public ResponseEntity<?> findById(@PathVariable("id") int id) {		
		return ResponseEntity.ok(module.findById(id));
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity<?> deleteById(@PathVariable("id") int id) {
		module.deleteModule(id);
		return ResponseEntity.ok("Deleted successfully");
	}
}
