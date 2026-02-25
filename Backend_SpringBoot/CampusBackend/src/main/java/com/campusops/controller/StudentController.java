package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campusops.services.ModularBatchRegistrationService;

@CrossOrigin
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private ModularBatchRegistrationService regService;

    // ================= DASHBOARD =================

    @GetMapping("/dashboard/{email}")
    public ResponseEntity<?> dashboard(
            @PathVariable String email) {

        return ResponseEntity.ok(
                regService.getStudentDashboard(email));
    }
}