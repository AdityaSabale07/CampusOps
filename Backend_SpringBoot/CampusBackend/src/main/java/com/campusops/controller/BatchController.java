package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campusops.entities.Batch;
import com.campusops.services.BatchService;

@CrossOrigin
@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired
    private BatchService batchService;

    // =====================================================
    // CREATE BATCH (OLD API - KEEPING FOR COMPATIBILITY)
    // =====================================================

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> createBatch(
            @PathVariable int courseId,
            @RequestBody Batch batch) {

        return ResponseEntity.ok(
                batchService.saveBatch(courseId, batch));
    }

    // =====================================================
    // NEW CREATE BATCH (FOR UI POST /api/batches)
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createBatchDirect(
            @RequestBody Batch batch) {

        if (batch.getCourse() == null ||
                batch.getCourse().getId() == 0) {

            throw new RuntimeException("Course ID required");
        }

        return ResponseEntity.ok(
                batchService.saveBatch(
                        batch.getCourse().getId(),
                        batch));
    }

    // =====================================================
    // GET ALL BATCHES
    // =====================================================

    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(
                batchService.listAll());
    }

    // =====================================================
    // GET BATCHES BY COURSE
    // =====================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getByCourse(
            @PathVariable int courseId) {

        return ResponseEntity.ok(
                batchService.getByCourse(courseId));
    }

    // =====================================================
    // DELETE BATCH
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {

        batchService.deleteBatch(id);
        return ResponseEntity.ok(
                "Batch deleted successfully");
    }
}