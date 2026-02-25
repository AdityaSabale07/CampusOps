package com.campusops.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.CourseRouterRepository;
import com.campusops.daos.ModuleRepository;
import com.campusops.daos.UserRepository;
import com.campusops.entities.CourseRouter;
import com.campusops.entities.Module;
import com.campusops.entities.User;

@Service
public class CourseRouterService {

    @Autowired
    private CourseRouterRepository courseRouterRepo;

    @Autowired
    private ModuleRepository moduleRepo;

    @Autowired
    private UserRepository userRepo;

    // ================= ADMIN: Assign Router To Module =================

    public CourseRouter assignRouter(Integer moduleId, Integer routerId) {

        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        User router = userRepo.findById(routerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!router.getRole().equalsIgnoreCase("STAFF")) {
            throw new RuntimeException("Only STAFF can be assigned as router");
        }

        // Check if router already assigned for this module
        CourseRouter existing = courseRouterRepo.findByModule(module);

        if (existing != null) {
            existing.setRouter(router);
            return courseRouterRepo.save(existing);
        }

        CourseRouter newRouter = new CourseRouter();
        newRouter.setModule(module);
        newRouter.setRouter(router);

        return courseRouterRepo.save(newRouter);
    }

    // ================= GET ROUTER BY MODULE =================

    public CourseRouter getRouterByModule(Integer moduleId) {

        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        return courseRouterRepo.findByModule(module);
    }

    // ================= GET ALL ROUTER MAPPINGS =================

    public List<CourseRouter> getAllRouters() {
        return courseRouterRepo.findAll();
    }

    // ================= REMOVE ROUTER FROM MODULE =================

    public void removeRouter(Integer moduleId) {

        Module module = moduleRepo.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        CourseRouter mapping = courseRouterRepo.findByModule(module);

        if (mapping != null) {
            courseRouterRepo.delete(mapping);
        }
    }
}
