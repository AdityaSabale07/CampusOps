package com.campusops.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.campusops.daos.CourseRepository;
import com.campusops.daos.UserRepository;
import com.campusops.entities.Course;
import com.campusops.entities.LogStatus;
import com.campusops.entities.Logs;
import com.campusops.entities.User;
import com.campusops.models.UserDTO;
import com.campusops.models.RemarkDTO;
import com.campusops.services.LogsService;
import com.campusops.services.UserService;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private LogsService logsService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // =====================================================
    // REGISTER USER (ADMIN / STAFF / TEACHER)
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/create")
    public User createUserByAdmin(@RequestBody UserDTO dto) {

        // ⭐ userid check ONLY IF PROVIDED
        if (dto.getUserid() != null &&
                userRepo.existsById(dto.getUserid())) {

            throw new RuntimeException("User already exists with userid");
        }

        // ✅ email uniqueness check
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        // ⭐ COPY but ignore userid (DB auto generates)
        BeanUtils.copyProperties(dto, user, "userid");

        user.setPwd(encoder.encode(dto.getPwd()));
        user.setRole(dto.getRole().toUpperCase());

        if (dto.getCourseId() != null) {
            Course course = courseRepo.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            user.setCourse(course);
        }

        return userRepo.save(user);
    }

    // =====================================================
    // NEW: GET USER BY EMAIL (Important for email login)
    // =====================================================

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {

        User user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    // =====================================================
    // STAFF OPERATIONS
    // =====================================================

    @GetMapping("/staff")
    public ResponseEntity<?> findAllStaff() {
        List<User> result = userService.getAllStaff();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/staff/course/{courseId}")
    public ResponseEntity<?> getStaffByCourse(@PathVariable Integer courseId) {
        return ResponseEntity.ok(userService.getStaffByCourse(courseId));
    }

    @PutMapping("/assign/{userid}/{courseId}")
    public ResponseEntity<?> assignToCourse(
            @PathVariable Integer userid,
            @PathVariable Integer courseId) {

        return ResponseEntity.ok(
                userService.assignUserToCourse(userid, courseId));
    }

    @GetMapping("/mylogs/{userid}")
    public List<Logs> getMyLogs(@PathVariable Integer userid) {
        return logsService.listByStaffId(userid);
    }

    // =====================================================
    // ADMIN OPERATIONS
    // =====================================================

    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getLogs(
            @RequestParam(value = "status", required = false, defaultValue = "All") String status) {

        List<Logs> logs = logsService.getAllLogs();

        if (!status.equalsIgnoreCase("All")) {
            LogStatus logStatus = LogStatus.valueOf(status.toUpperCase());
            logs = logs.stream()
                    .filter(log -> log.getStatus() == logStatus)
                    .toList();
        }

        return ResponseEntity.ok(logs);
    }

    @PutMapping("/approve/{logId}/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveLog(
            @PathVariable Integer logId,
            @PathVariable Integer adminId) {

        logsService.approveLog(logId, adminId);
        return ResponseEntity.ok("Log approved successfully");
    }

    @PutMapping("/reject/{logId}/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> rejectLog(
            @PathVariable Integer logId,
            @PathVariable Integer adminId,
            @RequestBody RemarkDTO dto) {

        logsService.rejectByAdmin(logId, adminId, dto.getRemark());
        return ResponseEntity.ok("Log rejected successfully");
    }

    // =====================================================
    // PROFILE OPERATIONS (COMMON)
    // =====================================================

    @GetMapping("/{userid}")
    public ResponseEntity<User> getUser(@PathVariable Integer userid) {
        User user = userService.findByUserId(userid);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userid}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Integer userid,
            @RequestBody UserDTO dto) {

        userService.updateProfile(userid, dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/{userid}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userid) {

        boolean isDeleted = userService.deleteUser(userid);

        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
    }
}
