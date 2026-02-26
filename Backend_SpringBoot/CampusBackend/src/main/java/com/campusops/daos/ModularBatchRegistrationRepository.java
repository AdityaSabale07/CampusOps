package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campusops.entities.ModularBatchRegistration;
import java.util.Optional;

public interface ModularBatchRegistrationRepository
        extends JpaRepository<ModularBatchRegistration, Integer> {

    long countByBatchId(int batchId);
    List<ModularBatchRegistration> findByStatus(String status);
    long countByEmailAndStatus(String email, String status);
    boolean existsByEmailAndStatus(String email,String status);
    
   

    Optional<ModularBatchRegistration> findTopByEmailOrderByIdDesc(String email);
    
}