package com.campusops.daos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.CourseRouter;
import com.campusops.entities.Module;
import com.campusops.entities.User;

@Repository
public interface CourseRouterRepository 
        extends JpaRepository<CourseRouter, Integer> {

    // ✅ Find router by module
    CourseRouter findByModule(Module module);

    // ✅ Check if router assigned to module
    boolean existsByModuleAndRouter(Module module, User router);
    
}
