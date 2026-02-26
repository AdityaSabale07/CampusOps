package com.campusops.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.BatchRepository;
import com.campusops.daos.DiscountRepository;
import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.daos.UserRepository;
import com.campusops.discount.DiscountEngine;
import com.campusops.entities.Batch;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;
import com.campusops.entities.User;
import com.campusops.models.AdminDashboardDTO;
import com.campusops.models.AdmissionStatusDTO;
import com.campusops.models.BatchReportDTO;
import com.campusops.models.CourseAnalyticsDTO;
import com.campusops.models.ModularBatchRegistrationDTO;
import com.campusops.models.RegistrationReportDTO;
import com.campusops.models.StudentDashboardDTO;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class ModularBatchRegistrationService {

    @Autowired private ModularBatchRegistrationRepository regRepo;
    @Autowired private BatchRepository batchRepo;
    @Autowired private DiscountRepository discountRepo;
    @Autowired private DiscountEngine discountEngine;
    @Autowired private UserRepository userRepo;
    @Autowired private BCryptPasswordEncoder encoder;
    @Autowired private NotificationService notificationService;

    // ================= STUDENT REGISTRATION =================

    public ModularBatchRegistration register(ModularBatchRegistrationDTO dto) {

        Batch batch = batchRepo.findById(dto.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        boolean alreadyPending =
                regRepo.existsByEmailAndStatus(dto.getEmail(), "PENDING");

        if (alreadyPending)
            throw new RuntimeException("You already have a pending registration.");

        long currentCount = regRepo.countByBatchId(batch.getId());

        if (batch.getCapacity() != null &&
                currentCount >= batch.getCapacity())
            throw new RuntimeException("Batch is full. Registration closed.");

        ModularBatchRegistration reg = new ModularBatchRegistration();

        reg.setStudentName(dto.getStudentName());
        reg.setEmail(dto.getEmail());
        reg.setPhone(dto.getPhone());
        reg.setBatch(batch);
        reg.setOriginalFee(batch.getFee());

        double discountAmount = 0;

        if (dto.getDiscountId() != null) {

            Discount discount = discountRepo.findById(dto.getDiscountId())
                    .orElseThrow(() -> new RuntimeException("Discount not found"));

            discountAmount =
                    discountEngine.calculateDiscount(reg, discount);

            reg.setDiscountName(discount.getName());
            reg.setDiscountType(discount.getType());

        } else {

            List<Discount> allDiscounts = discountRepo.findAll();

            discountAmount =
                    discountEngine.findBestDiscount(reg, allDiscounts);

            reg.setDiscountName("AUTO");
            reg.setDiscountType("BEST_AVAILABLE");
        }

        // ===== ENTERPRISE SAFETY =====

        if (discountAmount < 0)
            discountAmount = 0;

        if (discountAmount > reg.getOriginalFee())
            discountAmount = reg.getOriginalFee();

        double finalAmount =
                reg.getOriginalFee() - discountAmount;

        if (finalAmount <= 0) {
            finalAmount = reg.getOriginalFee();
            discountAmount = 0;
        }

        reg.setDiscountAmount(discountAmount);
        reg.setFinalAmount(finalAmount);

        String regId = "REG-"
                + LocalDate.now().getYear()
                + "-"
                + System.currentTimeMillis();

        reg.setRegistrationId(regId);

        return regRepo.save(reg);
    }

    // ================= LIST =================

    public List<ModularBatchRegistration> listAll() {
        return regRepo.findAll();
    }

    public ModularBatchRegistration findById(int id) {
        return regRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }

    // ================= OVERALL REPORT =================

    public RegistrationReportDTO getReport() {

        List<ModularBatchRegistration> all = regRepo.findAll();

        RegistrationReportDTO report = new RegistrationReportDTO();

        long total = all.size();

        double revenue = all.stream()
                .filter(r -> "APPROVED".equals(r.getStatus()))
                .mapToDouble(ModularBatchRegistration::getFinalAmount)
                .sum();

        double discount = all.stream()
                .filter(r -> "APPROVED".equals(r.getStatus()))
                .mapToDouble(ModularBatchRegistration::getDiscountAmount)
                .sum();

        double avg = total == 0 ? 0 : revenue / total;

        report.setTotalRegistrations(total);
        report.setTotalRevenue(revenue);
        report.setTotalDiscount(discount);
        report.setAverageFee(avg);

        return report;
    }

    // ================= BATCH REPORT =================

    public List<BatchReportDTO> getBatchReport() {

        List<ModularBatchRegistration> all =
                regRepo.findByStatus("APPROVED");

        return all.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getBatch().getBatchName()))
                .entrySet()
                .stream()
                .map(e -> {

                    BatchReportDTO dto = new BatchReportDTO();

                    dto.setBatchName(e.getKey());
                    dto.setTotalRegistrations(e.getValue().size());

                    double revenue =
                            e.getValue().stream()
                                    .mapToDouble(ModularBatchRegistration::getFinalAmount)
                                    .sum();

                    dto.setTotalRevenue(revenue);

                    return dto;
                }).toList();
    }

    // ================= APPROVE =================

    public void approveRegistration(int id) {

        ModularBatchRegistration reg =
                regRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Registration not found"));

        reg.setStatus("APPROVED");

        String tempPassword = "welcome123";
        reg.setTempPassword(tempPassword);

        regRepo.save(reg);

        createUserFromRegistration(reg);

        notificationService.sendWelcomeMessage(reg);
    }

    public void rejectRegistration(int id) {
        ModularBatchRegistration reg =
                regRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Registration not found"));

        reg.setStatus("REJECTED");
        regRepo.save(reg);
    }

    public List<ModularBatchRegistration> getByStatus(String status) {
        return regRepo.findByStatus(status);
    }

    // ================= USER CREATION =================

    private void createUserFromRegistration(ModularBatchRegistration reg) {

        if (userRepo.findByEmail(reg.getEmail()).isPresent())
            return;

        User user = new User();

        user.setUname(reg.getStudentName());
        user.setEmail(reg.getEmail());
        user.setPhone(reg.getPhone());
        user.setRole("STUDENT");
        user.setPwd(encoder.encode("welcome123"));

        if (reg.getBatch() != null &&
                reg.getBatch().getCourse() != null)
            user.setCourse(reg.getBatch().getCourse());

        userRepo.save(user);
    }

    // ================= STUDENT DASHBOARD =================

    public StudentDashboardDTO getStudentDashboard(String email) {

        ModularBatchRegistration reg =
                regRepo.findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() -> new RuntimeException("No registration found"));

        StudentDashboardDTO dto = new StudentDashboardDTO();

        dto.setStudentName(reg.getStudentName());
        dto.setEmail(reg.getEmail());
        dto.setStatus(reg.getStatus());

        if (reg.getBatch() != null) {
            dto.setBatchName(reg.getBatch().getBatchName());

            if (reg.getBatch().getCourse() != null)
                dto.setCourseName(reg.getBatch().getCourse().getCoursename());
        }

        dto.setOriginalFee(reg.getOriginalFee());
        dto.setDiscountAmount(reg.getDiscountAmount());
        dto.setFinalAmount(reg.getFinalAmount());
        dto.setDiscountName(reg.getDiscountName());
        dto.setDiscountType(reg.getDiscountType());

        return dto;
    }

    // ================= STATUS =================

    public AdmissionStatusDTO getStatusByEmail(String email) {

        ModularBatchRegistration reg =
                regRepo.findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() -> new RuntimeException("No admission found"));

        AdmissionStatusDTO dto = new AdmissionStatusDTO();

        dto.setStudentName(reg.getStudentName());
        dto.setEmail(reg.getEmail());
        dto.setStatus(reg.getStatus());
        dto.setFinalAmount(reg.getFinalAmount());
        dto.setTempPassword(reg.getTempPassword());
        dto.setDiscountName(reg.getDiscountName());
        dto.setDiscountType(reg.getDiscountType());
        dto.setRegistrationId(reg.getRegistrationId());

        if (reg.getBatch() != null) {
            dto.setBatchName(reg.getBatch().getBatchName());

            if (reg.getBatch().getCourse() != null)
                dto.setCourseName(reg.getBatch().getCourse().getCoursename());
        }

        return dto;
    }

    // ================= ADMIN DASHBOARD =================

    public AdminDashboardDTO getAdminDashboard() {

        List<ModularBatchRegistration> all =
                regRepo.findAll();

        AdminDashboardDTO dto =
                new AdminDashboardDTO();

        // ================= BASIC COUNTS =================

        dto.setTotalRegistrations(all.size());

        dto.setApproved(
                all.stream()
                   .filter(r -> "APPROVED".equals(r.getStatus()))
                   .count());

        dto.setPending(
                all.stream()
                   .filter(r -> "PENDING".equals(r.getStatus()))
                   .count());

        dto.setRejected(
                all.stream()
                   .filter(r -> "REJECTED".equals(r.getStatus()))
                   .count());

        // ================= REVENUE =================

        dto.setTotalRevenue(
                all.stream()
                   .filter(r -> "APPROVED".equals(r.getStatus()))
                   .mapToDouble(
                           ModularBatchRegistration::getFinalAmount)
                   .sum());

        dto.setTotalDiscount(
                all.stream()
                   .filter(r -> "APPROVED".equals(r.getStatus()))
                   .mapToDouble(
                           ModularBatchRegistration::getDiscountAmount)
                   .sum());

        // ================= COURSE ANALYTICS =================

        List<CourseAnalyticsDTO> courseStats =
                all.stream()
                   .filter(r ->
                           r.getBatch() != null &&
                           r.getBatch().getCourse() != null)
                   .collect(java.util.stream.Collectors.groupingBy(
                           r -> r.getBatch()
                                 .getCourse()
                                 .getCoursename()))
                   .entrySet()
                   .stream()
                   .map(e -> {

                       CourseAnalyticsDTO c =
                               new CourseAnalyticsDTO();

                       c.setCourseName(e.getKey());
                       c.setTotalRegistrations(
                               e.getValue().size());

                       double revenue =
                               e.getValue().stream()
                                       .mapToDouble(
                                           ModularBatchRegistration::getFinalAmount)
                                       .sum();

                       c.setTotalRevenue(revenue);

                       return c;
                   })
                   .toList();

        dto.setCourseAnalytics(courseStats);

        // ================= BATCH ANALYTICS =================

        dto.setBatchAnalytics(getBatchReport());

        return dto;
    }
}









//package com.sunbeam.services;
//
//import java.time.LocalDate;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.sunbeam.daos.BatchRepository;
//import com.sunbeam.daos.DiscountRepository;
//import com.sunbeam.daos.ModularBatchRegistrationRepository;
//import com.sunbeam.discount.DiscountEngine;
//import com.sunbeam.entities.Batch;
//import com.sunbeam.entities.Discount;
//import com.sunbeam.entities.ModularBatchRegistration;
//import com.sunbeam.models.AdminDashboardDTO;
//import com.sunbeam.models.BatchReportDTO;
//import com.sunbeam.models.CourseAnalyticsDTO;
//import com.sunbeam.models.ModularBatchRegistrationDTO;
//import com.sunbeam.models.RegistrationReportDTO;
//import com.sunbeam.models.StudentDashboardDTO;
//
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import com.sunbeam.daos.UserRepository;
//import com.sunbeam.entities.User;
//
//@Service
//public class ModularBatchRegistrationService {
//
//    @Autowired
//    private ModularBatchRegistrationRepository regRepo;
//
//    @Autowired
//    private BatchRepository batchRepo;
//
//    @Autowired
//    private DiscountRepository discountRepo;
//
//    @Autowired
//    private DiscountEngine discountEngine;
//    @Autowired
//    private UserRepository userRepo;
//
//    @Autowired
//    private BCryptPasswordEncoder encoder;
//    @Autowired
//    private NotificationService notificationService;
//
//    // ================= STUDENT REGISTRATION =================
//
//    public ModularBatchRegistration register(
//            ModularBatchRegistrationDTO dto) {
//
//        Batch batch = batchRepo.findById(dto.getBatchId())
//                .orElseThrow(() ->
//                        new RuntimeException("Batch not found"));
//
//        // ================= CAPACITY VALIDATION =================
//
//        long currentCount =
//                regRepo.countByBatchId(batch.getId());
//
//        if (batch.getCapacity() != null &&
//                currentCount >= batch.getCapacity()) {
//
//            throw new RuntimeException(
//                    "Batch is full. Registration closed.");
//        }
//
//        ModularBatchRegistration reg =
//                new ModularBatchRegistration();
//
//        // ================= STUDENT DATA =================
//        reg.setStudentName(dto.getStudentName());
//        reg.setEmail(dto.getEmail());
//        reg.setPhone(dto.getPhone());
//
//        // ================= BATCH RELATION =================
//        reg.setBatch(batch);
//
//        // ================= PAYMENT DETAILS =================
//        reg.setOriginalFee(batch.getFee());
//
//        double discountAmount = 0;
//
//        // ================= SMART DISCOUNT =================
//
//        // CASE 1 → Student selected discount
//        if (dto.getDiscountId() != null) {
//
//            Discount discount = discountRepo
//                    .findById(dto.getDiscountId())
//                    .orElseThrow(() ->
//                            new RuntimeException("Discount not found"));
//
//            discountAmount =
//                    discountEngine.calculateDiscount(
//                            reg, discount);
//        }
//
//        // CASE 2 → Auto best discount
//        else {
//
//            List<Discount> allDiscounts =
//                    discountRepo.findAll();
//
//            discountAmount =
//                    discountEngine.findBestDiscount(
//                            reg,
//                            allDiscounts);
//        }
//
//        reg.setDiscountAmount(discountAmount);
//
//        // ================= FINAL AMOUNT =================
//
//        reg.setFinalAmount(
//                reg.getOriginalFee() - discountAmount);
//
//        // ================= REGISTRATION ID =================
//
//        String regId = "REG-"
//                + LocalDate.now().getYear()
//                + "-"
//                + System.currentTimeMillis();
//
//        reg.setRegistrationId(regId);
//
//        return regRepo.save(reg);
//    }
//
//    // ================= LIST ALL =================
//
//    public List<ModularBatchRegistration> listAll() {
//        return regRepo.findAll();
//    }
//
//    // ================= FIND ONE =================
//
//    public ModularBatchRegistration findById(int id) {
//        return regRepo.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Registration not found"));
//    }
//
//    // ================= OVERALL REPORT =================
//
//    public RegistrationReportDTO getReport() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findAll();
//
//        RegistrationReportDTO report =
//                new RegistrationReportDTO();
//
//        long total = all.size();
//
//        double revenue = all.stream()
//                .mapToDouble(
//                        ModularBatchRegistration::getFinalAmount)
//                .sum();
//
//        double discount = all.stream()
//                .mapToDouble(
//                        ModularBatchRegistration::getDiscountAmount)
//                .sum();
//
//        double avg = total == 0 ? 0 : revenue / total;
//
//        report.setTotalRegistrations(total);
//        report.setTotalRevenue(revenue);
//        report.setTotalDiscount(discount);
//        report.setAverageFee(avg);
//
//        return report;
//    }
//
//    // ================= BATCH REPORT =================
//
//    public List<BatchReportDTO> getBatchReport() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findAll();
//
//        return all.stream()
//                .collect(java.util.stream.Collectors.groupingBy(
//                        r -> r.getBatch().getBatchName()))
//                .entrySet()
//                .stream()
//                .map(e -> {
//
//                    BatchReportDTO dto =
//                            new BatchReportDTO();
//
//                    dto.setBatchName(e.getKey());
//                    dto.setTotalRegistrations(
//                            e.getValue().size());
//
//                    double revenue =
//                            e.getValue().stream()
//                            .mapToDouble(
//                                ModularBatchRegistration::getFinalAmount)
//                            .sum();
//
//                    dto.setTotalRevenue(revenue);
//
//                    return dto;
//                })
//                .toList();
//    }
//    public void approveRegistration(int id) {
//
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Registration not found"));
//
//        // ===== STATUS =====
//        reg.setStatus("APPROVED");
//
//        regRepo.save(reg);
//
//        // ===== AUTO USER CREATION =====
//        createUserFromRegistration(reg);
//
//        // ===== SEND WELCOME MESSAGE =====
//        notificationService.sendWelcomeMessage(reg);
//    }
//    public void rejectRegistration(int id) {
//
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "Registration not found"));
//
//        reg.setStatus("REJECTED");
//
//        regRepo.save(reg);
//    }
//    public List<ModularBatchRegistration>
//    getByStatus(String status) {
//
//        return regRepo.findByStatus(status);
//    }
//    
//    private void createUserFromRegistration(
//            ModularBatchRegistration reg) {
//
//        // prevent duplicate users
//        if (userRepo.findByEmail(reg.getEmail()).isPresent()) {
//            return;
//        }
//
//        User user = new User();
//
//        // ===== BASIC INFO =====
//        user.setUname(reg.getStudentName());
//        user.setEmail(reg.getEmail());
//        user.setPhone(reg.getPhone());
//
//        // ===== ROLE =====
//        user.setRole("STUDENT");
//
//        // ===== PASSWORD =====
//        // temporary default password
//        user.setPwd(
//                encoder.encode("welcome123"));
//
//        // ===== COURSE =====
//        if (reg.getBatch() != null &&
//                reg.getBatch().getCourse() != null) {
//
//            user.setCourse(
//                    reg.getBatch().getCourse());
//        }
//
//        userRepo.save(user);
//    }
//    
//    public StudentDashboardDTO getStudentDashboard(
//            String email) {
//
//        ModularBatchRegistration reg =
//                regRepo.findTopByEmailOrderByIdDesc(email)
//                .orElseThrow(() ->
//                        new RuntimeException(
//                                "No registration found"));
//
//        StudentDashboardDTO dto =
//                new StudentDashboardDTO();
//
//        dto.setStudentName(reg.getStudentName());
//        dto.setEmail(reg.getEmail());
//
//        dto.setStatus(reg.getStatus());
//
//        dto.setBatchName(
//                reg.getBatch().getBatchName());
//
//        dto.setCourseName(
//                reg.getBatch()
//                .getCourse()
//                .getCoursename());
//
//        dto.setOriginalFee(reg.getOriginalFee());
//        dto.setDiscountAmount(reg.getDiscountAmount());
//        dto.setFinalAmount(reg.getFinalAmount());
//
//        return dto;
//    }
//    
//    public AdminDashboardDTO getAdminDashboard() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findAll();
//
//        AdminDashboardDTO dto =
//                new AdminDashboardDTO();
//
//        dto.setTotalRegistrations(all.size());
//
//        dto.setApproved(
//                all.stream()
//                .filter(r -> "APPROVED".equals(r.getStatus()))
//                .count());
//
//        dto.setPending(
//                all.stream()
//                .filter(r -> "PENDING".equals(r.getStatus()))
//                .count());
//
//        dto.setRejected(
//                all.stream()
//                .filter(r -> "REJECTED".equals(r.getStatus()))
//                .count());
//
//        dto.setTotalRevenue(
//                all.stream()
//                .mapToDouble(
//                        ModularBatchRegistration::getFinalAmount)
//                .sum());
//
//        dto.setTotalDiscount(
//                all.stream()
//                .mapToDouble(
//                        ModularBatchRegistration::getDiscountAmount)
//                .sum());
//
//        // ===== COURSE ANALYTICS =====
//
//        List<CourseAnalyticsDTO> courseStats =
//                all.stream()
//                .collect(java.util.stream.Collectors.groupingBy(
//                        r -> r.getBatch()
//                              .getCourse()
//                              .getCoursename()))
//                .entrySet()
//                .stream()
//                .map(e -> {
//
//                    CourseAnalyticsDTO c =
//                            new CourseAnalyticsDTO();
//
//                    c.setCourseName(e.getKey());
//                    c.setTotalRegistrations(
//                            e.getValue().size());
//
//                    double revenue =
//                            e.getValue().stream()
//                            .mapToDouble(
//                               ModularBatchRegistration::getFinalAmount)
//                            .sum();
//
//                    c.setTotalRevenue(revenue);
//
//                    return c;
//                })
//                .toList();
//
//        dto.setCourseAnalytics(courseStats);
//
//        // ===== BATCH ANALYTICS =====
//
//        dto.setBatchAnalytics(getBatchReport());
//
//        return dto;
//    }
//}