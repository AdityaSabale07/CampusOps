package com.campusops.daos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusops.entities.TemplateQuestion;

@Repository
public interface TemplateQuestionRepository extends JpaRepository<TemplateQuestion,Integer>{
    List<TemplateQuestion> findByTemplateId(Integer templateId);
    boolean existsByTemplateIdAndQuestionTextIgnoreCase(
            Integer templateId, String questionText);

    long countByTemplateId(Integer templateId);

}
