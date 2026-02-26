package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusops.entities.Batch;

public interface BatchRepository extends JpaRepository<Batch, Integer> {

    // get batches by course
    List<Batch> findByCourseId(int courseId);
}