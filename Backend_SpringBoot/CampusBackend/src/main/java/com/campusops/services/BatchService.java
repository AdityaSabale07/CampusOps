package com.campusops.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.BatchRepository;
import com.campusops.daos.CourseRepository;
import com.campusops.entities.Batch;
import com.campusops.entities.Course;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepo;

    @Autowired
    private CourseRepository courseRepo;

    // ================= SAVE BATCH =================

    public Batch saveBatch(int courseId, Batch batch) {

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        batch.setCourse(course);

        return batchRepo.save(batch);
    }

    // ================= GET ALL BATCHES =================

    public List<Batch> listAll() {
        return batchRepo.findAll();
    }

    // ================= GET BATCHES BY COURSE =================

    public List<Batch> getByCourse(int courseId) {
        return batchRepo.findByCourseId(courseId);
    }

    // ================= DELETE BATCH =================

    public void deleteBatch(int id) {
        batchRepo.deleteById(id);
    }

    // ================= FIND BY ID =================

    public Batch findById(int id) {
        return batchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
    }
}