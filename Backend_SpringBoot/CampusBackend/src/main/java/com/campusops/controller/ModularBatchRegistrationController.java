package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.campusops.models.ModularBatchRegistrationDTO;
import com.campusops.services.ModularBatchRegistrationService;

@CrossOrigin
@RestController
@RequestMapping("/api/modular-registration")
public class ModularBatchRegistrationController {

    @Autowired
    private ModularBatchRegistrationService regService;

    // ================= STUDENT REGISTRATION =================

    @PostMapping
    public ResponseEntity<?> register(
            @RequestBody ModularBatchRegistrationDTO dto) {

        return ResponseEntity.ok(
                regService.register(dto));
    }

    // ================= LIST ALL =================

    @GetMapping
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(
                regService.listAll());
    }

    // ================= REPORT =================

    @GetMapping("/report")
    public ResponseEntity<?> getReport() {
        return ResponseEntity.ok(
                regService.getReport());
    }

    @GetMapping("/report/batch")
    public ResponseEntity<?> getBatchReport() {
        return ResponseEntity.ok(
                regService.getBatchReport());
    }

    // ================= APPROVAL =================

    /**
     * ADMIN APPROVE
     * discountId = optional
     * null → keep auto discount
     * value → override discount
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approve(
            @PathVariable int id,
            @RequestParam(required = false) Integer discountId) {

        regService.approveRegistration(id, discountId);

        return ResponseEntity.ok("Registration approved");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> reject(
            @PathVariable int id) {

        regService.rejectRegistration(id);

        return ResponseEntity.ok("Registration rejected");
    }

    // ================= STATUS FILTER (ADMIN) =================

    @GetMapping("/status/list/{status}")
    public ResponseEntity<?> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                regService.getByStatus(
                        status.toUpperCase()));
    }

    // ================= STUDENT STATUS CHECK =================

    @GetMapping("/status/email/{email}")
    public ResponseEntity<?> checkStatusByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                regService.getStatusByEmail(email));
    }

    // ================= ADMIN DASHBOARD =================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public ResponseEntity<?> adminDashboard() {

        return ResponseEntity.ok(
                regService.getAdminDashboard());
    }
}







////package com.sunbeam.controller;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.http.ResponseEntity;
////import org.springframework.security.access.prepost.PreAuthorize;
////import org.springframework.web.bind.annotation.*;
////
////import com.sunbeam.models.ModularBatchRegistrationDTO;
////import com.sunbeam.services.ModularBatchRegistrationService;
////
////@CrossOrigin
////@RestController
////@RequestMapping("/api/modular-registration")
////public class ModularBatchRegistrationController {
////
////    @Autowired
////    private ModularBatchRegistrationService regService;
////
////    // ================= STUDENT REGISTRATION =================
////
////    @PostMapping
////    public ResponseEntity<?> register(
////            @RequestBody ModularBatchRegistrationDTO dto) {
////
////        return ResponseEntity.ok(regService.register(dto));
////    }
////
////    // ================= LIST ALL =================
////
////    @GetMapping
////    public ResponseEntity<?> listAll() {
////        return ResponseEntity.ok(regService.listAll());
////    }
////    @GetMapping("/report")
////    public ResponseEntity<?> getReport() {
////        return ResponseEntity.ok(
////                regService.getReport());
////    }
////
////    @GetMapping("/report/batch")
////    public ResponseEntity<?> getBatchReport() {
////        return ResponseEntity.ok(
////                regService.getBatchReport());
////    }
////    @PreAuthorize("hasRole('ADMIN')")
////    @PutMapping("/approve/{id}")
////    public ResponseEntity<?> approve(
////            @PathVariable int id) {
////
////        regService.approveRegistration(id);
////
////        return ResponseEntity.ok(
////                "Registration approved");
////    }
////    @PreAuthorize("hasRole('ADMIN')")
////    @PutMapping("/reject/{id}")
////    public ResponseEntity<?> reject(
////            @PathVariable int id) {
////
////        regService.rejectRegistration(id);
////
////        return ResponseEntity.ok(
////                "Registration rejected");
////    }
////    @GetMapping("/status/{status}")
////    public ResponseEntity<?> getByStatus(
////            @PathVariable String status) {
////
////        return ResponseEntity.ok(
////                regService.getByStatus(
////                        status.toUpperCase()));
////    }
////    @PreAuthorize("hasRole('ADMIN')")
////    @GetMapping("/admin/dashboard")
////    public ResponseEntity<?> adminDashboard() {
////
////        return ResponseEntity.ok(
////                regService.getAdminDashboard());
////    }
////    
////    
////}
//
//package com.campusops.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import com.campusops.models.ModularBatchRegistrationDTO;
//import com.campusops.services.ModularBatchRegistrationService;
//
//@CrossOrigin
//@RestController
//@RequestMapping("/api/modular-registration")
//public class ModularBatchRegistrationController {
//
//    @Autowired
//    private ModularBatchRegistrationService regService;
//
//    // ================= STUDENT REGISTRATION =================
//
//    @PostMapping
//    public ResponseEntity<?> register(
//            @RequestBody ModularBatchRegistrationDTO dto) {
//
//        return ResponseEntity.ok(
//                regService.register(dto));
//    }
//
//    // ================= LIST ALL =================
//
//    @GetMapping
//    public ResponseEntity<?> listAll() {
//        return ResponseEntity.ok(
//                regService.listAll());
//    }
//
//    // ================= REPORT =================
//
//    @GetMapping("/report")
//    public ResponseEntity<?> getReport() {
//        return ResponseEntity.ok(
//                regService.getReport());
//    }
//
//    @GetMapping("/report/batch")
//    public ResponseEntity<?> getBatchReport() {
//        return ResponseEntity.ok(
//                regService.getBatchReport());
//    }
//
//    // ================= APPROVAL =================
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PutMapping("/approve/{id}")
//    public ResponseEntity<?> approve(
//            @PathVariable int id) {
//
//        regService.approveRegistration(id);
//
//        return ResponseEntity.ok(
//                "Registration approved");
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PutMapping("/reject/{id}")
//    public ResponseEntity<?> reject(
//            @PathVariable int id) {
//
//        regService.rejectRegistration(id);
//
//        return ResponseEntity.ok(
//                "Registration rejected");
//    }
//
//    // ================= STATUS FILTER (ADMIN) =================
//    // 🔥 CHANGED PATH TO AVOID CONFLICT
//
//    @GetMapping("/status/list/{status}")
//    public ResponseEntity<?> getByStatus(
//            @PathVariable String status) {
//
//        return ResponseEntity.ok(
//                regService.getByStatus(
//                        status.toUpperCase()));
//    }
//
//    // ================= STUDENT STATUS CHECK =================
//
//    @GetMapping("/status/email/{email}")
//    public ResponseEntity<?> checkStatusByEmail(
//            @PathVariable String email) {
//
//        return ResponseEntity.ok(
//                regService.getStatusByEmail(email));
//    }
//
//    // ================= ADMIN DASHBOARD =================
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/admin/dashboard")
//    public ResponseEntity<?> adminDashboard() {
//
//        return ResponseEntity.ok(
//                regService.getAdminDashboard());
//    }
//}