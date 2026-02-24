package com.campusops.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.ModuleRepository;
import com.campusops.entities.Module;
import com.campusops.models.ModuleDTO;

@Service
public class ModuleService {

	@Autowired private ModuleRepository repo;
	@Autowired private CourseService cservice;
	
	
	public void saveModule(ModuleDTO dto) {
		Module module=new Module();
		module.setDescription(dto.getDescription());
		module.setTheoryhr(dto.getTheoryhr());
		module.setPracticalhr(dto.getPracticalhr());
		module.setCourse(cservice.findById(dto.getCourse_id()));		
		repo.save(module);
	}
	
	public List<Module> listall(){
		return repo.findAll();
	}
	
	public List<Module> listByCourse(int id){
		return repo.findByCourse(cservice.findById(id));
	}
	
	public void deleteModule(int id) {
		repo.delete(repo.getById(id));
	}
	
	public Module findById(int id) {
		return repo.getById(id);
	}
}

