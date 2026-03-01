package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.campusops.entities.Discount;
import com.campusops.services.DiscountService;

@CrossOrigin
@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    // ================= CREATE DISCOUNT =================
    // ADMIN ONLY

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Discount discount,
            @RequestParam(required = false) Integer batchId) {

        return ResponseEntity.ok(
                discountService.createDiscount(discount, batchId));
    }

    // ================= LIST ALL =================

    @GetMapping
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(discountService.listAll());
    }

    // ================= GET ONE =================

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(
            @PathVariable int id) {

        return ResponseEntity.ok(
                discountService.findById(id));
    }

    // ================= DELETE =================
    // ADMIN ONLY

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable int id) {

        discountService.deleteDiscount(id);

        return ResponseEntity.ok("Discount deleted");
    }

    // ================= ANALYTICS =================

    @GetMapping("/analytics")
    public ResponseEntity<?> analytics() {
        return ResponseEntity.ok(
                discountService.getAnalytics());
    }

    // ================= STUDENT BATCH DISCOUNTS =================
    // (FILTERED BY EMAIL)

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> getDiscountsByBatch(
            @PathVariable int batchId,
            @RequestParam String email) {

        return ResponseEntity.ok(
                discountService.getDiscountsByBatch(batchId, email)
        );
    }

    // ================= ⭐ ADMIN BATCH DISCOUNTS =================
    // 🔥 NEW ENDPOINT FOR APPROVAL PAGE

    @GetMapping("/batch/admin/{batchId}")
    public ResponseEntity<?> getDiscountsByBatchForAdmin(
            @PathVariable int batchId) {

        return ResponseEntity.ok(
                discountService.getDiscountsByBatchForAdmin(batchId)
        );
    }

    // ================= BEST DISCOUNT =================

    @GetMapping("/batch/{batchId}/best")
    public ResponseEntity<?> getBestDiscount(
            @PathVariable int batchId,
            @RequestParam String email) {

        return ResponseEntity.ok(
                discountService.getBestDiscount(
                        batchId,
                        email));
    }
}









//package com.campusops.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import com.campusops.entities.Discount;
//import com.campusops.services.DiscountService;
//
//@CrossOrigin
//@RestController
//@RequestMapping("/api/discounts")
//public class DiscountController {
//
//    @Autowired
//    private DiscountService discountService;
//
//    // ================= CREATE DISCOUNT =================
//    // ADMIN ONLY
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping
//    public ResponseEntity<?> create(
//            @RequestBody Discount discount,
//            @RequestParam(required = false) Integer batchId) {
//
//        return ResponseEntity.ok(
//                discountService.createDiscount(discount, batchId));
//    }
//
//    // ================= LIST ALL =================
//
//    @GetMapping
//    public ResponseEntity<?> listAll() {
//        return ResponseEntity.ok(discountService.listAll());
//    }
//
//    // ================= GET ONE =================
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> findById(
//            @PathVariable int id) {
//
//        return ResponseEntity.ok(
//                discountService.findById(id));
//    }
//
//    // ================= DELETE =================
//    // ADMIN ONLY
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> delete(
//            @PathVariable int id) {
//
//        discountService.deleteDiscount(id);
//
//        return ResponseEntity.ok("Discount deleted");
//    }
//    
//    @GetMapping("/analytics")
//    public ResponseEntity<?> analytics() {
//        return ResponseEntity.ok(
//                discountService.getAnalytics());
//    }
//    
//    @GetMapping("/batch/{batchId}")
//    public ResponseEntity<?> getDiscountsByBatch(
//            @PathVariable int batchId,
//            @RequestParam String email) {
//
//        return ResponseEntity.ok(
//                discountService.getDiscountsByBatch(batchId, email)
//        );
//    }
//    
//    @GetMapping("/batch/{batchId}/best")
//    public ResponseEntity<?> getBestDiscount(
//            @PathVariable int batchId,
//            @RequestParam String email) {
//
//        return ResponseEntity.ok(
//                discountService.getBestDiscount(
//                        batchId,
//                        email));
//    }
//}