package com.campusops.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class CourseRouter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "module_id", unique = true) 
    // 🔥 unique = true means 1 module = 1 router
    private Module module;

    @ManyToOne
    @JoinColumn(name = "router_id")
    private User router;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Module getModule() {
		return module;
	}

	public void setModule(Module module) {
		this.module = module;
	}

	public User getRouter() {
		return router;
	}

	public void setRouter(User router) {
		this.router = router;
	}

   
    
}
