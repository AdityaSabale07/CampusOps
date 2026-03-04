package com.campusops.services;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.campusops.entities.Course;
import com.campusops.entities.User;
import com.campusops.models.UserDTO;
import com.campusops.daos.CourseRepository;
import com.campusops.daos.UserRepository;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // ================= REGISTER USER BY ADMIN =================

    public User createUserByAdmin(UserDTO dto) {

    	if (dto.getUserid() != null &&
    	        userRepo.existsById(dto.getUserid())) {

    	    throw new RuntimeException("User already exists with userid");
    	}

        // ✅ NEW: check email uniqueness
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        BeanUtils.copyProperties(dto, user);

        // 🔐 Encode password
        user.setPwd(encoder.encode(dto.getPwd()));

        // 🔒 Force uppercase role
        user.setRole(dto.getRole().toUpperCase());

        return userRepo.save(user);
    }

    // ================= REGISTER USER =================

    public User registerUser(UserDTO dto) {

        if (userRepo.existsById(dto.getUserid())) {
            throw new RuntimeException("User already exists with userid");
        }

        // ✅ NEW: check email uniqueness
        if (userRepo.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        BeanUtils.copyProperties(dto, user);

        // 🔐 Encode password
        user.setPwd(encoder.encode(dto.getPwd()));

        // Ensure role is stored in uppercase
        user.setRole(dto.getRole().toUpperCase());

        return userRepo.save(user);
    }

    // ================= FIND USER BY USERID =================

    public User findByUserId(int userid) {
        return userRepo.findById(userid)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));
    }

    // ================= NEW: FIND USER BY EMAIL =================

    public User findByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found with email"));
    }

    // ================= LIST ALL STAFF =================

    public List<User> getAllStaff() {
        return userRepo.findAll()
                .stream()
                .filter(u -> "STAFF".equals(u.getRole()))
                .collect(Collectors.toList());
    }

    // ================= VERIFY USER ID =================

    public boolean verifyUserId(Integer userid) {
        return userRepo.existsById(userid);
    }

    // ================= UPDATE PROFILE =================

    public void updateProfile(Integer userid, UserDTO dto) {

        User user = userRepo.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Update normal fields
        user.setUname(dto.getUname());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setStaffid(dto.getStaffid());

        // ✅ NEW: allow email update (optional)
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {

            // check if another user already has this email
            userRepo.findByEmail(dto.getEmail())
                    .filter(u -> u.getUserid() != userid)
                    .ifPresent(u -> {
                        throw new RuntimeException("Email already in use");
                    });

            user.setEmail(dto.getEmail());
        }

        // 🔐 Update password only if provided
        if (dto.getPwd() != null && !dto.getPwd().isBlank()) {
            user.setPwd(encoder.encode(dto.getPwd()));
        }

        userRepo.save(user);
    }

    // ================= DELETE USER =================

    public boolean deleteUser(int userid) {

        if (userRepo.existsById(userid)) {
            userRepo.deleteById(userid);
            return true;
        }

        return false;
    }

    // ================= ASSIGN USER TO COURSE =================

    public User assignUserToCourse(int userid, int courseId) {

        User user = userRepo.findById(userid)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Course not found"));

        user.setCourse(course);

        return userRepo.save(user);
    }

    // ================= GET STAFF BY COURSE =================

    public List<User> getStaffByCourse(int courseId) {
        return userRepo.findByCourseIdAndRole(courseId, "STAFF");
    }

    // ================= ASSIGN TASK OR LOG TO STAFF =================

    public User assignTaskOrLogToStaff(int staffUserid) {

        User user = userRepo.findById(staffUserid)
                .orElseThrow(() ->
                        new EntityNotFoundException("Staff not found"));

        if (!"STAFF".equals(user.getRole())) {
            throw new RuntimeException("Only STAFF can receive logs/tasks");
        }

        return user;
    }
}

