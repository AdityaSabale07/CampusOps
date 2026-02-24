package com.campusops.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.campusops.models.LoginDTO;
import com.campusops.security.JwtUtil;
import com.campusops.entities.User;
import com.campusops.daos.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    // Optional: for generating encoded password
    @GetMapping("/generate")
    public String generate() {
        return new BCryptPasswordEncoder().encode("admin123");
    }

    // ================= LOGIN USING EMAIL =================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

        // 🔐 Authenticate using EMAIL + PASSWORD
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),   // ✅ changed
                        dto.getPwd()
                )
        );

        // ✅ Find user by EMAIL
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Generate token with EMAIL as subject
        String token = jwtUtil.generateToken(
                user.getEmail(),     // subject = email
                user.getRole()
        );

        return ResponseEntity.ok(token);
    }
}
