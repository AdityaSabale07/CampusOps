package com.campusops.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusops.entities.ModularBatchRegistration;

public interface ModularBatchRegistrationRepository
        extends JpaRepository<ModularBatchRegistration, Integer> {

    long countByBatchId(int batchId);

    List<ModularBatchRegistration> findByStatus(String status);

    long countByEmailAndStatus(String email, String status);

    boolean existsByEmailAndStatus(String email, String status);

    // used in some dashboards / student view
    Optional<ModularBatchRegistration> findTopByEmailOrderByIdDesc(String email);

    // ⭐ NEW METHOD (for multiple admissions per email)
    List<ModularBatchRegistration> findByEmailOrderByIdDesc(String email);

}