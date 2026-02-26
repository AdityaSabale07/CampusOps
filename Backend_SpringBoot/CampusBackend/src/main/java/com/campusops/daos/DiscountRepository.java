package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.campusops.entities.Discount;

public interface DiscountRepository
        extends JpaRepository<Discount, Integer> {
	List<Discount> findByBatch_Id(int batchId);
}