package com.campusops.daos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.FeedbackTemplate;

@Repository
public interface FeedbackTemplateRepository extends JpaRepository<FeedbackTemplate,Integer>{}
