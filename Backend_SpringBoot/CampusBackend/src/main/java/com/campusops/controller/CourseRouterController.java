package com.campusops.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.campusops.entities.CourseRouter;
import com.campusops.services.CourseRouterService;

@CrossOrigin
@RestController
@RequestMapping("/api/course-router")
public class CourseRouterController {

    @Autowired
    private CourseRouterService courseRouterService;

    // ================= ADMIN: ASSIGN ROUTER TO MODULE =================
    @PostMapping("/assign/{moduleId}/{routerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRouter(
            @PathVariable Integer moduleId,
            @PathVariable Integer routerId) {

        CourseRouter router = courseRouterService.assignRouter(moduleId, routerId);
        return ResponseEntity.ok(router);
    }

    // ================= GET ROUTER FOR MODULE =================
    @GetMapping("/module/{moduleId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> getRouterByModule(
            @PathVariable Integer moduleId) {

        return ResponseEntity.ok(
                courseRouterService.getRouterByModule(moduleId));
    }

    // ================= GET ALL ROUTER MAPPINGS =================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseRouter>> getAllRouters() {

        return ResponseEntity.ok(
                courseRouterService.getAllRouters());
    }
}
