package com.campusops.security;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // ================= PASSWORD ENCODER =================
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ================= AUTH MANAGER =================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ================= SECURITY FILTER CHAIN =================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // =====================================================
                // 🔓 AUTH APIs
                // =====================================================
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/generate").permitAll()

                // =====================================================
                // 🔓 PUBLIC ADMISSION APIs
                // =====================================================

                // modular courses dropdown
                .requestMatchers("/api/courses/modular").permitAll()

                // batches by course
                .requestMatchers("/api/batches/course/**").permitAll()

                // ⭐ STUDENT REGISTRATION (POST)
                .requestMatchers("/api/modular-registration").permitAll()

                // ⭐ STATUS CHECK
                .requestMatchers("/api/modular-registration/status/**")
                .permitAll()

                // ⭐ NEW → DISCOUNT OFFERS (VERY IMPORTANT)
                .requestMatchers("/api/discounts/batch/**")
                .permitAll()
                .requestMatchers("/api/payment/**").permitAll()

                // =====================================================
                // 🔓 SWAGGER
                // =====================================================
                .requestMatchers(
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-ui.html"
                ).permitAll()

                // =====================================================
                // 🔒 LOG MODULE
                // =====================================================
                .requestMatchers("/api/logs/**").authenticated()

                // =====================================================
                // 🔒 FEEDBACK MODULE
                // =====================================================
                .requestMatchers("/api/feedback/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/feedback/submit/**").hasRole("STUDENT")
                .requestMatchers("/api/feedback/student/**").hasRole("STUDENT")
                .requestMatchers("/api/feedback/staff/**").hasRole("STAFF")

                // =====================================================
                // 🔒 EVERYTHING ELSE PROTECTED
                // =====================================================
                .anyRequest().authenticated()
            )

            .sessionManagement(sess ->
                    sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .addFilterBefore(jwtFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ================= CORS =================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://localhost:5173");

        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}