package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.campusops.models.LogsDTO;
import com.campusops.models.RemarkDTO;
import com.campusops.services.LogsService;

@CrossOrigin
@RestController
@RequestMapping("/api/logs")
public class LogsController {

    @Autowired
    private LogsService logsService;

    // ================= STAFF =================

    @PostMapping("/savelog")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> save(@RequestBody LogsDTO dto) {

        logsService.saveLog(dto);
        return ResponseEntity.ok("Log registered successfully");
    }

    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getLogsByStaffId(@PathVariable int staffId) {

        return ResponseEntity.ok(logsService.listByStaffId(staffId));
    }

    // 🔥 STAFF UPDATE REJECTED LOG
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateLog(@PathVariable int id,
                                       @RequestBody LogsDTO dto) {

        logsService.updateLog(id, dto);
        return ResponseEntity.ok("Log updated & sent for verification");
    }

    // 🔥 STAFF DELETE REJECTED LOG
    @DeleteMapping("/staff/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteRejectedLog(@PathVariable int id) {

        logsService.deleteLog(id);
        return ResponseEntity.ok("Rejected log deleted successfully");
    }

    // ================= ROUTER =================

    @GetMapping("/router/{routerId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getLogsForRouter(@PathVariable int routerId) {

        return ResponseEntity.ok(logsService.getLogsForRouter(routerId));
    }

    @PutMapping("/verify/{logId}/{routerId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> verifyLog(@PathVariable int logId,
                                       @PathVariable int routerId) {

        logsService.verifyLog(logId, routerId);
        return ResponseEntity.ok("Log verified successfully");
    }

    @PutMapping("/reject/router/{logId}/{routerId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> rejectByRouter(@PathVariable int logId,
                                            @PathVariable int routerId,
                                            @RequestBody RemarkDTO dto) {

        logsService.rejectByRouter(logId, routerId, dto.getRemark());
        return ResponseEntity.ok("Log rejected by router");
    }

    // ================= ADMIN =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllLogs() {

        return ResponseEntity.ok(logsService.getAllLogs());
    }

    @PutMapping("/approve/{logId}/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveLog(@PathVariable int logId,
                                        @PathVariable int adminId) {

        logsService.approveLog(logId, adminId);
        return ResponseEntity.ok("Log approved successfully");
    }

    @PutMapping("/reject/admin/{logId}/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectByAdmin(@PathVariable int logId,
                                           @PathVariable int adminId,
                                           @RequestBody RemarkDTO dto) {

        logsService.rejectByAdmin(logId, adminId, dto.getRemark());
        return ResponseEntity.ok("Log rejected by admin");
    }

    // 🔥 ADMIN CAN DELETE ANY LOG
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteById(@PathVariable int id) {

        logsService.deleteLog(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ================= COMMON =================

    @GetMapping("/course/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> findByCourse(@PathVariable int id) {

        return ResponseEntity.ok(logsService.listByCourse(id));
    }

    @GetMapping("/module/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> findByModule(@PathVariable int id) {

        return ResponseEntity.ok(logsService.listByModule(id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> findById(@PathVariable int id) {

        return ResponseEntity.ok(logsService.findById(id));
    }
}
