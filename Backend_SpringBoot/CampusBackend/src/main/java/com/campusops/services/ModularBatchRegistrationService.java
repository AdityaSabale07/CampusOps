package com.campusops.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.campusops.daos.*;
import com.campusops.discount.DiscountEngine;
import com.campusops.entities.*;
import com.campusops.models.*;

@Service
public class ModularBatchRegistrationService {

    @Autowired private ModularBatchRegistrationRepository regRepo;
    @Autowired private BatchRepository batchRepo;
    @Autowired private DiscountRepository discountRepo;
    @Autowired private DiscountEngine discountEngine;
    @Autowired private UserRepository userRepo;
    @Autowired private BCryptPasswordEncoder encoder;
    @Autowired private NotificationService notificationService;

    // ================= REGISTRATION =================

    public ModularBatchRegistration register(ModularBatchRegistrationDTO dto) {

        Batch batch = batchRepo.findById(dto.getBatchId())
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        boolean pending =
                regRepo.existsByEmailAndStatus(dto.getEmail(), "PENDING");

        if (pending)
            throw new RuntimeException("Already pending registration.");

        long count = regRepo.countByBatchId(batch.getId());

        if (batch.getCapacity() != null &&
                count >= batch.getCapacity())
            throw new RuntimeException("Batch full");

        ModularBatchRegistration reg = new ModularBatchRegistration();

        reg.setStudentName(dto.getStudentName());
        reg.setEmail(dto.getEmail());
        reg.setPhone(dto.getPhone());
        reg.setBatch(batch);
        reg.setOriginalFee(batch.getFee());
        reg.setStatus("PENDING");

        // ===== AUTO DISCOUNT =====
        double discountAmount = 0;

        List<Discount> batchDiscounts =
                discountRepo.findByBatch_Id(batch.getId());

        discountAmount =
                discountEngine.findBestDiscount(reg, batchDiscounts);

        if (discountAmount > 0) {
            reg.setDiscountName("AUTO");
            reg.setDiscountType("AUTO_APPLIED");
        }

        if (discountAmount < 0)
            discountAmount = 0;

        if (discountAmount > reg.getOriginalFee())
            discountAmount = reg.getOriginalFee();

        reg.setDiscountAmount(discountAmount);
        reg.setFinalAmount(reg.getOriginalFee() - discountAmount);

        String regId =
                "REG-" + LocalDate.now().getYear()
                        + "-" + System.currentTimeMillis();

        reg.setRegistrationId(regId);

        return regRepo.save(reg);
    }

    // ================= APPROVE =================

    public void approveRegistration(int id) {
        approveRegistration(id, null);
    }

    public void approveRegistration(int id, Integer discountId) {

        ModularBatchRegistration reg =
                regRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Registration not found"));

        if (!"PENDING".equals(reg.getStatus()))
            return;

        if (discountId != null) {

            Discount discount =
                    discountRepo.findById(discountId)
                            .orElseThrow(() ->
                                    new RuntimeException("Discount not found"));

            if (discount.getBatch() != null &&
                    discount.getBatch().getId() != reg.getBatch().getId())
                throw new RuntimeException("Discount not valid for batch");

            double discountAmount =
                    discountEngine.calculateDiscount(reg, discount);

            if (discountAmount < 0)
                discountAmount = 0;

            if (discountAmount > reg.getOriginalFee())
                discountAmount = reg.getOriginalFee();

            reg.setDiscountAmount(discountAmount);
            reg.setFinalAmount(reg.getOriginalFee() - discountAmount);
            reg.setDiscountName(discount.getName());
            reg.setDiscountType(discount.getType());
        }

        // ===== NEW PAYMENT FLOW =====
        reg.setStatus("APPROVED");
        reg.setPaymentStatus("PENDING");
        reg.setPaymentDueDate(LocalDate.now().plusDays(5));

        // login only after payment
        reg.setTempPassword(null);

        regRepo.save(reg);

        // user creation moved after payment
    }

    public void rejectRegistration(int id) {
        ModularBatchRegistration reg =
                regRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Registration not found"));

        reg.setStatus("REJECTED");
        regRepo.save(reg);
    }

    // ================= BASIC LIST =================

    public List<ModularBatchRegistration> listAll() {
        return regRepo.findAll();
    }

    public ModularBatchRegistration findById(int id) {
        return regRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Registration not found"));
    }

    public List<ModularBatchRegistration> getByStatus(String status) {
        return regRepo.findByStatus(status);
    }

    // ================= STATUS BY EMAIL =================

    public AdmissionStatusDTO getStatusByEmail(String email) {

        ModularBatchRegistration reg =
                regRepo.findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() ->
                                new RuntimeException("No admission found"));

        AdmissionStatusDTO dto = new AdmissionStatusDTO();
        dto.setId(reg.getId());
        dto.setStudentName(reg.getStudentName());
        dto.setEmail(reg.getEmail());
        dto.setStatus(reg.getStatus());
        dto.setFinalAmount(reg.getFinalAmount());
        dto.setTempPassword(reg.getTempPassword());
        dto.setDiscountName(reg.getDiscountName());
        dto.setDiscountType(reg.getDiscountType());
        dto.setRegistrationId(reg.getRegistrationId());

        // ⭐ NEW PAYMENT INFO
        dto.setPaymentStatus(reg.getPaymentStatus());
        dto.setPaymentDueDate(reg.getPaymentDueDate());

        if (reg.getBatch() != null) {
            dto.setBatchName(reg.getBatch().getBatchName());

            if (reg.getBatch().getCourse() != null)
                dto.setCourseName(
                        reg.getBatch().getCourse().getCoursename());
        }

        return dto;
    }

    // ================= REPORT =================

    public RegistrationReportDTO getReport() {

        List<ModularBatchRegistration> all = regRepo.findAll();

        RegistrationReportDTO r = new RegistrationReportDTO();

        r.setTotalRegistrations(all.size());

        double revenue =
                all.stream()
                        .filter(x -> "APPROVED".equals(x.getStatus()))
                        .mapToDouble(ModularBatchRegistration::getFinalAmount)
                        .sum();

        double discount =
                all.stream()
                        .filter(x -> "APPROVED".equals(x.getStatus()))
                        .mapToDouble(ModularBatchRegistration::getDiscountAmount)
                        .sum();

        r.setTotalRevenue(revenue);
        r.setTotalDiscount(discount);
        r.setAverageFee(all.isEmpty() ? 0 : revenue / all.size());

        return r;
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
                    dto.setTotalRevenue(
                            e.getValue().stream()
                                    .mapToDouble(
                                            ModularBatchRegistration::getFinalAmount)
                                    .sum());
                    return dto;
                }).toList();
    }

    // ================= ADMIN DASHBOARD =================

    public AdminDashboardDTO getAdminDashboard() {

        List<ModularBatchRegistration> all =
                regRepo.findAll();
        
        
        AdminDashboardDTO dto = new AdminDashboardDTO();
        
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

        dto.setTotalRevenue(
                all.stream()
                        .filter(r -> "APPROVED".equals(r.getStatus()))
                        .mapToDouble(ModularBatchRegistration::getFinalAmount)
                        .sum());

        dto.setTotalDiscount(
                all.stream()
                        .filter(r -> "APPROVED".equals(r.getStatus()))
                        .mapToDouble(ModularBatchRegistration::getDiscountAmount)
                        .sum());

        dto.setBatchAnalytics(getBatchReport());

        return dto;
    }

    // ================= USER CREATION (KEPT SAFE) =================

    public void createUserFromRegistration(ModularBatchRegistration reg) {

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
}























//package com.campusops.services;
//
//import java.time.LocalDate;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import com.campusops.daos.*;
//import com.campusops.discount.DiscountEngine;
//import com.campusops.entities.*;
//import com.campusops.models.*;
//
//@Service
//public class ModularBatchRegistrationService {
//
//    @Autowired private ModularBatchRegistrationRepository regRepo;
//    @Autowired private BatchRepository batchRepo;
//    @Autowired private DiscountRepository discountRepo;
//    @Autowired private DiscountEngine discountEngine;
//    @Autowired private UserRepository userRepo;
//    @Autowired private BCryptPasswordEncoder encoder;
//    @Autowired private NotificationService notificationService;
//
//    // ================= REGISTRATION =================
//
//    public ModularBatchRegistration register(ModularBatchRegistrationDTO dto) {
//
//        Batch batch = batchRepo.findById(dto.getBatchId())
//                .orElseThrow(() -> new RuntimeException("Batch not found"));
//
//        boolean pending =
//                regRepo.existsByEmailAndStatus(dto.getEmail(), "PENDING");
//
//        if (pending)
//            throw new RuntimeException("Already pending registration.");
//
//        long count = regRepo.countByBatchId(batch.getId());
//
//        if (batch.getCapacity() != null &&
//                count >= batch.getCapacity())
//            throw new RuntimeException("Batch full");
//
//        ModularBatchRegistration reg = new ModularBatchRegistration();
//
//        reg.setStudentName(dto.getStudentName());
//        reg.setEmail(dto.getEmail());
//        reg.setPhone(dto.getPhone());
//        reg.setBatch(batch);
//        reg.setOriginalFee(batch.getFee());
//        reg.setStatus("PENDING");
//
//        // ===== AUTO DISCOUNT =====
//        double discountAmount = 0;
//
//        List<Discount> batchDiscounts =
//                discountRepo.findByBatch_Id(batch.getId());
//
//        discountAmount =
//                discountEngine.findBestDiscount(reg, batchDiscounts);
//
//        if (discountAmount > 0) {
//            reg.setDiscountName("AUTO");
//            reg.setDiscountType("AUTO_APPLIED");
//        }
//
//        if (discountAmount < 0)
//            discountAmount = 0;
//
//        if (discountAmount > reg.getOriginalFee())
//            discountAmount = reg.getOriginalFee();
//
//        reg.setDiscountAmount(discountAmount);
//        reg.setFinalAmount(reg.getOriginalFee() - discountAmount);
//
//        String regId =
//                "REG-" + LocalDate.now().getYear()
//                        + "-" + System.currentTimeMillis();
//
//        reg.setRegistrationId(regId);
//
//        return regRepo.save(reg);
//    }
//
//    // ================= APPROVE =================
//
//    public void approveRegistration(int id) {
//        approveRegistration(id, null);
//    }
//
//    public void approveRegistration(int id, Integer discountId) {
//
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                        .orElseThrow(() ->
//                                new RuntimeException("Registration not found"));
//
//        if (!"PENDING".equals(reg.getStatus()))
//            return;
//
//        if (discountId != null) {
//
//            Discount discount =
//                    discountRepo.findById(discountId)
//                            .orElseThrow(() ->
//                                    new RuntimeException("Discount not found"));
//
//            if (discount.getBatch() != null &&
//                    discount.getBatch().getId() != reg.getBatch().getId())
//                throw new RuntimeException("Discount not valid for batch");
//
//            double discountAmount =
//                    discountEngine.calculateDiscount(reg, discount);
//
//            if (discountAmount < 0)
//                discountAmount = 0;
//
//            if (discountAmount > reg.getOriginalFee())
//                discountAmount = reg.getOriginalFee();
//
//            reg.setDiscountAmount(discountAmount);
//            reg.setFinalAmount(reg.getOriginalFee() - discountAmount);
//            reg.setDiscountName(discount.getName());
//            reg.setDiscountType(discount.getType());
//        }
//
//        reg.setStatus("APPROVED");
//
//        reg.setTempPassword("welcome123");
//
//        regRepo.save(reg);
//
//        createUserFromRegistration(reg);
//        notificationService.sendWelcomeMessage(reg);
//    }
//
//    public void rejectRegistration(int id) {
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                        .orElseThrow(() ->
//                                new RuntimeException("Registration not found"));
//
//        reg.setStatus("REJECTED");
//        regRepo.save(reg);
//    }
//
//    // ================= BASIC LIST =================
//
//    public List<ModularBatchRegistration> listAll() {
//        return regRepo.findAll();
//    }
//
//    public ModularBatchRegistration findById(int id) {
//        return regRepo.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException("Registration not found"));
//    }
//
//    public List<ModularBatchRegistration> getByStatus(String status) {
//        return regRepo.findByStatus(status);
//    }
//
//    // ================= STATUS BY EMAIL =================
//
//    public AdmissionStatusDTO getStatusByEmail(String email) {
//
//        ModularBatchRegistration reg =
//                regRepo.findTopByEmailOrderByIdDesc(email)
//                        .orElseThrow(() ->
//                                new RuntimeException("No admission found"));
//
//        AdmissionStatusDTO dto = new AdmissionStatusDTO();
//
//        dto.setStudentName(reg.getStudentName());
//        dto.setEmail(reg.getEmail());
//        dto.setStatus(reg.getStatus());
//        dto.setFinalAmount(reg.getFinalAmount());
//        dto.setTempPassword(reg.getTempPassword());
//        dto.setDiscountName(reg.getDiscountName());
//        dto.setDiscountType(reg.getDiscountType());
//        dto.setRegistrationId(reg.getRegistrationId());
//
//        if (reg.getBatch() != null) {
//            dto.setBatchName(reg.getBatch().getBatchName());
//
//            if (reg.getBatch().getCourse() != null)
//                dto.setCourseName(
//                        reg.getBatch().getCourse().getCoursename());
//        }
//
//        return dto;
//    }
//
//    // ================= REPORT =================
//
//    public RegistrationReportDTO getReport() {
//
//        List<ModularBatchRegistration> all = regRepo.findAll();
//
//        RegistrationReportDTO r = new RegistrationReportDTO();
//
//        r.setTotalRegistrations(all.size());
//
//        double revenue =
//                all.stream()
//                        .filter(x -> "APPROVED".equals(x.getStatus()))
//                        .mapToDouble(ModularBatchRegistration::getFinalAmount)
//                        .sum();
//
//        double discount =
//                all.stream()
//                        .filter(x -> "APPROVED".equals(x.getStatus()))
//                        .mapToDouble(ModularBatchRegistration::getDiscountAmount)
//                        .sum();
//
//        r.setTotalRevenue(revenue);
//        r.setTotalDiscount(discount);
//        r.setAverageFee(all.isEmpty() ? 0 : revenue / all.size());
//
//        return r;
//    }
//
//    // ================= BATCH REPORT =================
//
//    public List<BatchReportDTO> getBatchReport() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findByStatus("APPROVED");
//
//        return all.stream()
//                .collect(java.util.stream.Collectors.groupingBy(
//                        r -> r.getBatch().getBatchName()))
//                .entrySet()
//                .stream()
//                .map(e -> {
//                    BatchReportDTO dto = new BatchReportDTO();
//                    dto.setBatchName(e.getKey());
//                    dto.setTotalRegistrations(e.getValue().size());
//                    dto.setTotalRevenue(
//                            e.getValue().stream()
//                                    .mapToDouble(
//                                            ModularBatchRegistration::getFinalAmount)
//                                    .sum());
//                    return dto;
//                }).toList();
//    }
//
//    // ================= ADMIN DASHBOARD =================
//
//    public AdminDashboardDTO getAdminDashboard() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findAll();
//
//        AdminDashboardDTO dto = new AdminDashboardDTO();
//
//        // ================= BASIC COUNTS =================
//
//        dto.setTotalRegistrations(all.size());
//
//        dto.setApproved(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .count());
//
//        dto.setPending(
//                all.stream()
//                   .filter(r -> "PENDING".equals(r.getStatus()))
//                   .count());
//
//        dto.setRejected(
//                all.stream()
//                   .filter(r -> "REJECTED".equals(r.getStatus()))
//                   .count());
//
//        // ================= REVENUE =================
//
//        dto.setTotalRevenue(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .mapToDouble(ModularBatchRegistration::getFinalAmount)
//                   .sum());
//
//        dto.setTotalDiscount(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .mapToDouble(ModularBatchRegistration::getDiscountAmount)
//                   .sum());
//
//        // ================= COURSE ANALYTICS ⭐ FIXED =================
//
//        List<CourseAnalyticsDTO> courseStats =
//                all.stream()
//
//                   // ONLY APPROVED
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//
//                   // SAFE NULL CHECK
//                   .filter(r ->
//                           r.getBatch() != null &&
//                           r.getBatch().getCourse() != null)
//
//                   .collect(java.util.stream.Collectors.groupingBy(
//                           r -> r.getBatch()
//                                 .getCourse()
//                                 .getCoursename()))
//                   .entrySet()
//                   .stream()
//                   .map(e -> {
//
//                       CourseAnalyticsDTO c =
//                               new CourseAnalyticsDTO();
//
//                       c.setCourseName(e.getKey());
//
//                       c.setTotalRegistrations(
//                               e.getValue().size());
//
//                       double revenue =
//                               e.getValue().stream()
//                                       .mapToDouble(
//                                           ModularBatchRegistration::getFinalAmount)
//                                       .sum();
//
//                       c.setTotalRevenue(revenue);
//
//                       return c;
//                   })
//                   .toList();
//
//        dto.setCourseAnalytics(courseStats);
//
//        // ================= BATCH ANALYTICS =================
//
//        dto.setBatchAnalytics(getBatchReport());
//
//        return dto;
//    }
//
//    // ================= USER CREATION =================
//
//    private void createUserFromRegistration(ModularBatchRegistration reg) {
//
//        if (userRepo.findByEmail(reg.getEmail()).isPresent())
//            return;
//
//        User user = new User();
//
//        user.setUname(reg.getStudentName());
//        user.setEmail(reg.getEmail());
//        user.setPhone(reg.getPhone());
//        user.setRole("STUDENT");
//        user.setPwd(encoder.encode("welcome123"));
//
//        if (reg.getBatch() != null &&
//                reg.getBatch().getCourse() != null)
//            user.setCourse(reg.getBatch().getCourse());
//
//        userRepo.save(user);
//    }
//    
//  // ================= STUDENT DASHBOARD =================
//
//  public StudentDashboardDTO getStudentDashboard(String email) {
//
//      ModularBatchRegistration reg =
//              regRepo.findTopByEmailOrderByIdDesc(email)
//                      .orElseThrow(() -> new RuntimeException("No registration found"));
//
//      StudentDashboardDTO dto = new StudentDashboardDTO();
//
//      dto.setStudentName(reg.getStudentName());
//      dto.setEmail(reg.getEmail());
//      dto.setStatus(reg.getStatus());
//
//      if (reg.getBatch() != null) {
//          dto.setBatchName(reg.getBatch().getBatchName());
//
//          if (reg.getBatch().getCourse() != null)
//              dto.setCourseName(reg.getBatch().getCourse().getCoursename());
//      }
//
//      dto.setOriginalFee(reg.getOriginalFee());
//      dto.setDiscountAmount(reg.getDiscountAmount());
//      dto.setFinalAmount(reg.getFinalAmount());
//      dto.setDiscountName(reg.getDiscountName());
//      dto.setDiscountType(reg.getDiscountType());
//
//      return dto;
//  }
//    
//    
//    
//    
//}























//package com.campusops.services;
//
//import java.time.LocalDate;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.campusops.daos.BatchRepository;
//import com.campusops.daos.DiscountRepository;
//import com.campusops.daos.ModularBatchRegistrationRepository;
//import com.campusops.daos.UserRepository;
//import com.campusops.discount.DiscountEngine;
//import com.campusops.entities.Batch;
//import com.campusops.entities.Discount;
//import com.campusops.entities.ModularBatchRegistration;
//import com.campusops.entities.User;
//import com.campusops.models.AdminDashboardDTO;
//import com.campusops.models.AdmissionStatusDTO;
//import com.campusops.models.BatchReportDTO;
//import com.campusops.models.CourseAnalyticsDTO;
//import com.campusops.models.ModularBatchRegistrationDTO;
//import com.campusops.models.RegistrationReportDTO;
//import com.campusops.models.StudentDashboardDTO;
//
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//@Service
//public class ModularBatchRegistrationService {
//
//    @Autowired private ModularBatchRegistrationRepository regRepo;
//    @Autowired private BatchRepository batchRepo;
//    @Autowired private DiscountRepository discountRepo;
//    @Autowired private DiscountEngine discountEngine;
//    @Autowired private UserRepository userRepo;
//    @Autowired private BCryptPasswordEncoder encoder;
//    @Autowired private NotificationService notificationService;
//
//    // ================= STUDENT REGISTRATION =================
//
//    public ModularBatchRegistration register(ModularBatchRegistrationDTO dto) {
//
//        Batch batch = batchRepo.findById(dto.getBatchId())
//                .orElseThrow(() -> new RuntimeException("Batch not found"));
//
//        boolean alreadyPending =
//                regRepo.existsByEmailAndStatus(dto.getEmail(), "PENDING");
//
//        if (alreadyPending)
//            throw new RuntimeException("You already have a pending registration.");
//
//        long currentCount = regRepo.countByBatchId(batch.getId());
//
//        if (batch.getCapacity() != null &&
//                currentCount >= batch.getCapacity())
//            throw new RuntimeException("Batch is full. Registration closed.");
//
//        ModularBatchRegistration reg = new ModularBatchRegistration();
//
//        reg.setStudentName(dto.getStudentName());
//        reg.setEmail(dto.getEmail());
//        reg.setPhone(dto.getPhone());
//        reg.setBatch(batch);
//        reg.setOriginalFee(batch.getFee());
//
//        double discountAmount = 0;
//
//        if (dto.getDiscountId() != null) {
//
//            Discount discount = discountRepo.findById(dto.getDiscountId())
//                    .orElseThrow(() -> new RuntimeException("Discount not found"));
//
//            discountAmount =
//                    discountEngine.calculateDiscount(reg, discount);
//
//            reg.setDiscountName(discount.getName());
//            reg.setDiscountType(discount.getType());
//
//        } else {
//
//            List<Discount> allDiscounts = discountRepo.findAll();
//
//            discountAmount =
//                    discountEngine.findBestDiscount(reg, allDiscounts);
//
//            reg.setDiscountName("AUTO");
//            reg.setDiscountType("BEST_AVAILABLE");
//        }
//
//        // ===== ENTERPRISE SAFETY =====
//
//        if (discountAmount < 0)
//            discountAmount = 0;
//
//        if (discountAmount > reg.getOriginalFee())
//            discountAmount = reg.getOriginalFee();
//
//        double finalAmount =
//                reg.getOriginalFee() - discountAmount;
//
//        if (finalAmount <= 0) {
//            finalAmount = reg.getOriginalFee();
//            discountAmount = 0;
//        }
//
//        reg.setDiscountAmount(discountAmount);
//        reg.setFinalAmount(finalAmount);
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
//    // ================= LIST =================
//
//    public List<ModularBatchRegistration> listAll() {
//        return regRepo.findAll();
//    }
//
//    public ModularBatchRegistration findById(int id) {
//        return regRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Registration not found"));
//    }
//
//    // ================= OVERALL REPORT =================
//
//    public RegistrationReportDTO getReport() {
//
//        List<ModularBatchRegistration> all = regRepo.findAll();
//
//        RegistrationReportDTO report = new RegistrationReportDTO();
//
//        long total = all.size();
//
//        double revenue = all.stream()
//                .filter(r -> "APPROVED".equals(r.getStatus()))
//                .mapToDouble(ModularBatchRegistration::getFinalAmount)
//                .sum();
//
//        double discount = all.stream()
//                .filter(r -> "APPROVED".equals(r.getStatus()))
//                .mapToDouble(ModularBatchRegistration::getDiscountAmount)
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
//                regRepo.findByStatus("APPROVED");
//
//        return all.stream()
//                .collect(java.util.stream.Collectors.groupingBy(
//                        r -> r.getBatch().getBatchName()))
//                .entrySet()
//                .stream()
//                .map(e -> {
//
//                    BatchReportDTO dto = new BatchReportDTO();
//
//                    dto.setBatchName(e.getKey());
//                    dto.setTotalRegistrations(e.getValue().size());
//
//                    double revenue =
//                            e.getValue().stream()
//                                    .mapToDouble(ModularBatchRegistration::getFinalAmount)
//                                    .sum();
//
//                    dto.setTotalRevenue(revenue);
//
//                    return dto;
//                }).toList();
//    }
//
//    // ================= APPROVE =================
//
//    public void approveRegistration(int id) {
//
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                        .orElseThrow(() -> new RuntimeException("Registration not found"));
//
//        reg.setStatus("APPROVED");
//
//        String tempPassword = "welcome123";
//        reg.setTempPassword(tempPassword);
//
//        regRepo.save(reg);
//
//        createUserFromRegistration(reg);
//
//        notificationService.sendWelcomeMessage(reg);
//    }
//
//    public void rejectRegistration(int id) {
//        ModularBatchRegistration reg =
//                regRepo.findById(id)
//                        .orElseThrow(() -> new RuntimeException("Registration not found"));
//
//        reg.setStatus("REJECTED");
//        regRepo.save(reg);
//    }
//
//    public List<ModularBatchRegistration> getByStatus(String status) {
//        return regRepo.findByStatus(status);
//    }
//
//    // ================= USER CREATION =================
//
//    private void createUserFromRegistration(ModularBatchRegistration reg) {
//
//        if (userRepo.findByEmail(reg.getEmail()).isPresent())
//            return;
//
//        User user = new User();
//
//        user.setUname(reg.getStudentName());
//        user.setEmail(reg.getEmail());
//        user.setPhone(reg.getPhone());
//        user.setRole("STUDENT");
//        user.setPwd(encoder.encode("welcome123"));
//
//        if (reg.getBatch() != null &&
//                reg.getBatch().getCourse() != null)
//            user.setCourse(reg.getBatch().getCourse());
//
//        userRepo.save(user);
//    }
//
//    // ================= STUDENT DASHBOARD =================
//
//    public StudentDashboardDTO getStudentDashboard(String email) {
//
//        ModularBatchRegistration reg =
//                regRepo.findTopByEmailOrderByIdDesc(email)
//                        .orElseThrow(() -> new RuntimeException("No registration found"));
//
//        StudentDashboardDTO dto = new StudentDashboardDTO();
//
//        dto.setStudentName(reg.getStudentName());
//        dto.setEmail(reg.getEmail());
//        dto.setStatus(reg.getStatus());
//
//        if (reg.getBatch() != null) {
//            dto.setBatchName(reg.getBatch().getBatchName());
//
//            if (reg.getBatch().getCourse() != null)
//                dto.setCourseName(reg.getBatch().getCourse().getCoursename());
//        }
//
//        dto.setOriginalFee(reg.getOriginalFee());
//        dto.setDiscountAmount(reg.getDiscountAmount());
//        dto.setFinalAmount(reg.getFinalAmount());
//        dto.setDiscountName(reg.getDiscountName());
//        dto.setDiscountType(reg.getDiscountType());
//
//        return dto;
//    }
//
//    // ================= STATUS =================
//
//    public AdmissionStatusDTO getStatusByEmail(String email) {
//
//        ModularBatchRegistration reg =
//                regRepo.findTopByEmailOrderByIdDesc(email)
//                        .orElseThrow(() -> new RuntimeException("No admission found"));
//
//        AdmissionStatusDTO dto = new AdmissionStatusDTO();
//
//        dto.setStudentName(reg.getStudentName());
//        dto.setEmail(reg.getEmail());
//        dto.setStatus(reg.getStatus());
//        dto.setFinalAmount(reg.getFinalAmount());
//        dto.setTempPassword(reg.getTempPassword());
//        dto.setDiscountName(reg.getDiscountName());
//        dto.setDiscountType(reg.getDiscountType());
//        dto.setRegistrationId(reg.getRegistrationId());
//
//        if (reg.getBatch() != null) {
//            dto.setBatchName(reg.getBatch().getBatchName());
//
//            if (reg.getBatch().getCourse() != null)
//                dto.setCourseName(reg.getBatch().getCourse().getCoursename());
//        }
//
//        return dto;
//    }
//
//    // ================= ADMIN DASHBOARD =================
//
//    public AdminDashboardDTO getAdminDashboard() {
//
//        List<ModularBatchRegistration> all =
//                regRepo.findAll();
//
//        AdminDashboardDTO dto =
//                new AdminDashboardDTO();
//
//        // ================= BASIC COUNTS =================
//
//        dto.setTotalRegistrations(all.size());
//
//        dto.setApproved(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .count());
//
//        dto.setPending(
//                all.stream()
//                   .filter(r -> "PENDING".equals(r.getStatus()))
//                   .count());
//
//        dto.setRejected(
//                all.stream()
//                   .filter(r -> "REJECTED".equals(r.getStatus()))
//                   .count());
//
//        // ================= REVENUE =================
//
//        dto.setTotalRevenue(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .mapToDouble(
//                           ModularBatchRegistration::getFinalAmount)
//                   .sum());
//
//        dto.setTotalDiscount(
//                all.stream()
//                   .filter(r -> "APPROVED".equals(r.getStatus()))
//                   .mapToDouble(
//                           ModularBatchRegistration::getDiscountAmount)
//                   .sum());
//
//        // ================= COURSE ANALYTICS =================
//
//        List<CourseAnalyticsDTO> courseStats =
//                all.stream()
//                   .filter(r ->
//                           r.getBatch() != null &&
//                           r.getBatch().getCourse() != null)
//                   .collect(java.util.stream.Collectors.groupingBy(
//                           r -> r.getBatch()
//                                 .getCourse()
//                                 .getCoursename()))
//                   .entrySet()
//                   .stream()
//                   .map(e -> {
//
//                       CourseAnalyticsDTO c =
//                               new CourseAnalyticsDTO();
//
//                       c.setCourseName(e.getKey());
//                       c.setTotalRegistrations(
//                               e.getValue().size());
//
//                       double revenue =
//                               e.getValue().stream()
//                                       .mapToDouble(
//                                           ModularBatchRegistration::getFinalAmount)
//                                       .sum();
//
//                       c.setTotalRevenue(revenue);
//
//                       return c;
//                   })
//                   .toList();
//
//        dto.setCourseAnalytics(courseStats);
//
//        // ================= BATCH ANALYTICS =================
//
//        dto.setBatchAnalytics(getBatchReport());
//
//        return dto;
//    }
//}
