package com.campusops.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.campusops.entities.FeedbackTemplate;
import com.campusops.entities.ScheduledFeedback;
import com.campusops.entities.TemplateQuestion;
import com.campusops.models.QuestionListDTO;
import com.campusops.models.ReportDTO;
import com.campusops.models.SubmitFeedbackDTO;
import com.campusops.services.FeedbackSystemService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin
public class FeedbackSystemController {

    @Autowired 
    FeedbackSystemService service;

    // ================= ADMIN =================

    @GetMapping("/admin/template")
    public List<FeedbackTemplate> getAllTemplates() {
        return service.getAllTemplates();
    }
    
    
    @GetMapping("/template/{id}")
    public FeedbackTemplate getTemplate(@PathVariable Integer id) {
        return service.getTemplateById(id);
    }



    @PostMapping("/admin/template")
    public FeedbackTemplate create(@RequestBody Map<String, String> body){
        return service.createTemplate(body.get("title"));
    }

    @PostMapping("/admin/question")
    public TemplateQuestion addQ(@RequestParam Integer templateId,
                                 @RequestParam String text){
        return service.addQuestion(templateId,text);
    }

    @PostMapping("/admin/questions/bulk")
    public List<TemplateQuestion> addMultiple(
            @RequestBody QuestionListDTO dto) {
        return service.addMultipleQuestions(dto);
    }

    @PostMapping("/admin/schedule")
    public ScheduledFeedback schedule(
            @RequestParam Integer templateId,
            @RequestParam Integer staffUserid,
            @RequestParam Integer courseId,
            @RequestParam Integer moduleId,
            @RequestParam String start,
            @RequestParam String end) {

        return service.schedule(
                templateId,
                staffUserid,
                courseId,
                moduleId,
                LocalDate.parse(start),
                LocalDate.parse(end)
        );
    }
    
    @GetMapping("/admin/schedules")
    public List<ScheduledFeedback> getAllSchedules() {
        return service.getAllSchedules();
    }


    @PutMapping("/admin/close/{scheduleId}")
    public ScheduledFeedback close(@PathVariable Integer scheduleId){
        return service.closeSession(scheduleId);
    }

    @PutMapping("/admin/send/{feedbackId}")
    public ScheduledFeedback sendToStaff(@PathVariable Integer feedbackId) {
        return service.sendFeedbackToStaff(feedbackId);
    }

    @GetMapping("/admin/report/intermediate/{feedbackId}")
    public ReportDTO adminIntermediate(@PathVariable Integer feedbackId) {
        return service.getIntermediateReport(feedbackId);
    }

    @GetMapping("/admin/report/final/{feedbackId}")
    public ReportDTO adminFinal(@PathVariable Integer feedbackId) {
        return service.getFinalReport(feedbackId);
    }

    // ================= STUDENT =================

    @GetMapping("/student/course/{courseId}")
    public List<ScheduledFeedback> getStudentFeedback(@PathVariable Integer courseId) {
        return service.getActiveFeedbackForStudent(courseId);
    }

    @PostMapping("/student/submit/{scheduleId}")
    public void submit(@PathVariable Integer scheduleId,
                       @RequestBody SubmitFeedbackDTO dto){
        service.submit(scheduleId,dto);
    }

    // ================= STAFF =================

    @GetMapping("/staff/{userid}")
    public List<ScheduledFeedback> staffFeedback(@PathVariable Integer userid) {
        return service.getFeedbackForStaff(userid);
    }

    @GetMapping("/staff/report/final/{feedbackId}")
    public ReportDTO staffFinalReport(@PathVariable Integer feedbackId) {
        return service.getFinalReport(feedbackId);
    }
    
    
    @PutMapping("/admin/question/{id}")
    public TemplateQuestion updateQuestion(
            @PathVariable Integer id,
            @RequestParam String text) {
        return service.updateQuestion(id, text);
    }

    @DeleteMapping("/admin/question/{id}")
    public void deleteQuestion(@PathVariable Integer id) {
        service.deleteQuestion(id);
    }

}
