package com.campusops.services;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.*;
import com.campusops.entities.*;
import com.campusops.models.*;

@Service
@Transactional
public class FeedbackSystemService {

    @Autowired private FeedbackTemplateRepository templateRepo;
    @Autowired private TemplateQuestionRepository questionRepo;
    @Autowired private ScheduledFeedbackRepository scheduleRepo;
    @Autowired private FeedbackSubmissionRepository submissionRepo;
    @Autowired private SubmissionAnswerRepository answerRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private ModuleRepository moduleRepo;

    // ================= ADMIN =================

    public List<FeedbackTemplate> getAllTemplates() {
        return templateRepo.findAll();
    }

    public FeedbackTemplate getTemplateById(Integer id) {
        return templateRepo.findById(id)
                .orElseThrow(() -> 
                    new RuntimeException("Template not found"));
    }

    
    public FeedbackTemplate createTemplate(String name) {
        FeedbackTemplate t = new FeedbackTemplate();
        t.setName(name);
        t.setLocked(false); // IMPORTANT
        return templateRepo.save(t);
    }

    // Single question (with duplicate prevention)
    public TemplateQuestion addQuestion(Integer templateId, String text) {

        FeedbackTemplate template = templateRepo.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (template.isLocked())
            throw new RuntimeException("Template is locked. Cannot modify.");

        if (questionRepo.existsByTemplateIdAndQuestionTextIgnoreCase(
                templateId, text))
            throw new RuntimeException("Duplicate question in same template");

        TemplateQuestion q = new TemplateQuestion();
        q.setQuestionText(text);
        q.setTemplate(template);

        return questionRepo.save(q);
    }

    // Bulk question insert
    public List<TemplateQuestion> addMultipleQuestions(QuestionListDTO dto) {

        FeedbackTemplate template = templateRepo.findById(dto.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (template.isLocked())
            throw new RuntimeException("Template is locked. Cannot modify.");

        

        List<TemplateQuestion> saved = new ArrayList<>();

        for (String text : dto.getQuestions()) {

            if (questionRepo.existsByTemplateIdAndQuestionTextIgnoreCase(
                    dto.getTemplateId(), text))
                throw new RuntimeException("Duplicate question: " + text);

            TemplateQuestion q = new TemplateQuestion();
            q.setQuestionText(text.trim());
            q.setTemplate(template);

            saved.add(questionRepo.save(q));
        }

        return saved;
    }

    // Update question
    public TemplateQuestion updateQuestion(Integer questionId, String text) {

        TemplateQuestion question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getTemplate().isLocked())
            throw new RuntimeException("Template is locked");

        question.setQuestionText(text.trim());
        return questionRepo.save(question);
    }

    // Delete question
    public void deleteQuestion(Integer questionId) {

        TemplateQuestion question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getTemplate().isLocked())
            throw new RuntimeException("Template is locked");

        questionRepo.delete(question);
    }

    // ================= STAFF =================

    public ScheduledFeedback schedule(
            Integer templateId,
            Integer staffUserid,
            Integer courseId,
            Integer moduleId,
            LocalDate start,
            LocalDate end) {

        FeedbackTemplate template = templateRepo.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (questionRepo.countByTemplateId(templateId) < 5)
            throw new RuntimeException("Template must have minimum 5 questions");

        template.setLocked(true); // LOCK TEMPLATE
        templateRepo.save(template);

        ScheduledFeedback sf = new ScheduledFeedback();
        sf.setTemplate(template);
        sf.setStaff(userRepo.findById(staffUserid)
                .orElseThrow(() -> new RuntimeException("Staff not found")));
        sf.setCourse(courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found")));
        sf.setModule(moduleRepo.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found")));
        sf.setStartDate(start);
        sf.setEndDate(end);
        sf.setStatus("OPEN");

        return scheduleRepo.save(sf);
    }
    
    public List<ScheduledFeedback> getAllSchedules() {
        return scheduleRepo.findAll();
    }


    public ScheduledFeedback closeSession(Integer scheduleId) {
        ScheduledFeedback sf = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        sf.setStatus("CLOSED");
        return scheduleRepo.save(sf);
    }

    public void autoCloseExpired() {
        List<ScheduledFeedback> active = scheduleRepo.findByStatus("OPEN");
        LocalDate today = LocalDate.now();

        for (ScheduledFeedback s : active) {
            if (s.getEndDate().isBefore(today)) {
                s.setStatus("CLOSED");
                scheduleRepo.save(s);
            }
        }
    }

    
    
    // ================= STUDENT =================

    public List<ScheduledFeedback> getActiveFeedbackForStudent(Integer courseId) {
        autoCloseExpired();
        return scheduleRepo.findByCourseIdAndStatus(courseId, "OPEN");
    }

    public void submit(int scheduleId, SubmitFeedbackDTO dto) {

        // 1️⃣ Check if feedback session exists
        ScheduledFeedback sf = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // 2️⃣ Check session is OPEN
        if (!"OPEN".equals(sf.getStatus())) {
            throw new RuntimeException("Feedback session is not active");
        }

        // 3️⃣ Load student
        User student = userRepo.findById(dto.studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 4️⃣ Validate role
        if (!"STUDENT".equals(student.getRole())) {
            throw new RuntimeException("Only STUDENT can submit feedback");
        }

        // 5️⃣ Validate student belongs to same course
        if (student.getCourse() == null ||
            student.getCourse().getId()!=(sf.getCourse().getId())) {

            throw new RuntimeException(
                    "Student does not belong to this course");
        }

        // 6️⃣ Prevent duplicate submission
        if (submissionRepo.existsByScheduledFeedbackIdAndStudentId(
                scheduleId, dto.studentId)) {

            throw new RuntimeException("Feedback already submitted");
        }

        // 7️⃣ Save submission
        FeedbackSubmission sub = new FeedbackSubmission();
        sub.setStudentId(dto.studentId);
        sub.setComments(dto.comments);
        sub.setScheduledFeedback(sf);

        sub = submissionRepo.save(sub);

        // 8️⃣ Save answers
        for (Integer qid : dto.answers.keySet()) {

            int rating = dto.answers.get(qid);

            if (rating < 1 || rating > 4) {
                throw new RuntimeException("Rating must be between 1 and 4");
            }

            TemplateQuestion question =
                    questionRepo.findById(qid)
                            .orElseThrow(() ->
                                    new RuntimeException("Invalid question"));

            SubmissionAnswer sa = new SubmissionAnswer();
            sa.setSubmission(sub);
            sa.setQuestion(question);
            sa.setRating(rating);

            answerRepo.save(sa);
        }
    }


    
    
    
    // ================= ADMIN SEND =================

    public ScheduledFeedback sendFeedbackToStaff(Integer id) {

        ScheduledFeedback sf = scheduleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        if (!"CLOSED".equals(sf.getStatus()))
            throw new RuntimeException("Must be CLOSED first");

        sf.setStatus("SENT");
        return scheduleRepo.save(sf);
    }

    public List<ScheduledFeedback> getFeedbackForStaff(int staffUserid) {
        return scheduleRepo.findByStaffUseridAndStatus(staffUserid, "SENT");
    }

    // ================= REPORT =================

    private ReportDTO generateReport(Integer scheduleId) {

        // 1️⃣ Load Scheduled Feedback
        ScheduledFeedback sf = scheduleRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // 2️⃣ Load all answers
        List<SubmissionAnswer> list =
                answerRepo.findBySubmissionScheduledFeedbackId(scheduleId);

        // 3️⃣ Group answers by Question ID
        Map<Integer, List<SubmissionAnswer>> byQ =
                list.stream()
                        .collect(Collectors.groupingBy(
                                a -> a.getQuestion().getId()));

        List<QuestionReportDTO> qreports = new ArrayList<>();
        double finalSum = 0;

        // 4️⃣ Loop each question
        for (Integer qid : byQ.keySet()) {

            List<SubmissionAnswer> ans = byQ.get(qid);

            QuestionReportDTO q = new QuestionReportDTO();

            TemplateQuestion tq = ans.get(0).getQuestion(); 
            // 🔥 No extra DB call needed

            q.questionId = qid;
            q.questionText = tq.getQuestionText();

            q.excellent = ans.stream().filter(a -> a.getRating() == 4).count();
            q.good = ans.stream().filter(a -> a.getRating() == 3).count();
            q.satisfactory = ans.stream().filter(a -> a.getRating() == 2).count();
            q.poor = ans.stream().filter(a -> a.getRating() == 1).count();

            q.average = ans.stream()
                    .mapToInt(SubmissionAnswer::getRating)
                    .average()
                    .orElse(0);

            finalSum += q.average;
            qreports.add(q);
        }

        // 5️⃣ Create ReportDTO
        ReportDTO r = new ReportDTO();

        // 🔥 ADD METADATA
        r.staffName = sf.getStaff().getUname();
        r.courseName = sf.getCourse().getCoursename();
        r.moduleName = sf.getModule().getDescription();
        r.templateName = sf.getTemplate().getName();

        r.questions = qreports;

        r.totalFeedback =
                submissionRepo.findByScheduledFeedbackId(scheduleId).size();

        r.finalAverage =
                qreports.isEmpty() ? 0 : finalSum / qreports.size();

        return r;
    }


    public ReportDTO getIntermediateReport(Integer id) {
        ScheduledFeedback sf = scheduleRepo.findById(id).orElseThrow();
        if (!"OPEN".equals(sf.getStatus()))
            throw new RuntimeException("Available only while OPEN");
        return generateReport(id);
    }

    public ReportDTO getFinalReport(Integer id) {
        ScheduledFeedback sf = scheduleRepo.findById(id).orElseThrow();
        if (!("CLOSED".equals(sf.getStatus())
                || "SENT".equals(sf.getStatus())))
            throw new RuntimeException("Available only after CLOSED");
        return generateReport(id);
    }
}
