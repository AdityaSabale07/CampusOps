package com.campusops.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.BatchRepository;
import com.campusops.daos.DiscountRepository;
import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.discount.DiscountEngine;
import com.campusops.entities.Batch;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;
import com.campusops.models.BestDiscountResult;
import com.campusops.models.DiscountAnalyticsDTO;
import com.campusops.models.DiscountDTO;

@Service
public class DiscountService {

    @Autowired
    private DiscountRepository discountRepo;

    @Autowired
    private BatchRepository batchRepo;

    @Autowired
    private ModularBatchRegistrationRepository regRepo;

    @Autowired
    private DiscountEngine discountEngine;

    // ================= CREATE DISCOUNT =================

    public Discount createDiscount(
            Discount discount,
            Integer batchId) {

        if (batchId != null) {

            Batch batch = batchRepo.findById(batchId)
                    .orElseThrow(() ->
                            new RuntimeException("Batch not found"));

            discount.setBatch(batch);
        }

        return discountRepo.save(discount);
    }

    // ================= LIST ALL =================

    public List<Discount> listAll() {
        return discountRepo.findAll();
    }

    // ================= DELETE =================

    public void deleteDiscount(int id) {
        discountRepo.deleteById(id);
    }

    // ================= FIND ONE =================

    public Discount findById(int id) {
        return discountRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Discount not found"));
    }

    // ================= ANALYTICS =================

    public List<DiscountAnalyticsDTO> getAnalytics() {

        List<ModularBatchRegistration> all =
                regRepo.findAll();

        return all.stream()
                .filter(r -> r.getDiscountName() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        r -> r.getDiscountName()))
                .entrySet()
                .stream()
                .map(e -> {

                    DiscountAnalyticsDTO dto =
                            new DiscountAnalyticsDTO();

                    dto.setDiscountName(e.getKey());

                    dto.setDiscountType(
                            e.getValue().get(0).getDiscountType());

                    dto.setUsageCount(e.getValue().size());

                    dto.setTotalDiscount(
                            e.getValue().stream()
                                    .mapToDouble(
                                            ModularBatchRegistration::getDiscountAmount)
                                    .sum());

                    dto.setTotalRevenue(
                            e.getValue().stream()
                                    .mapToDouble(
                                            ModularBatchRegistration::getFinalAmount)
                                    .sum());

                    return dto;
                })
                .toList();
    }

    // ================= STUDENT VIEW (FILTERED) =================

    public List<DiscountDTO> getDiscountsByBatch(int batchId, String email) {

        LocalDate today = LocalDate.now();

        List<Discount> discounts =
                discountRepo.findByBatch_Id(batchId);

        return discounts.stream()

                .filter(d -> {

                    // ===== DATE VALIDATION =====
                    if (d.getStartDate() != null &&
                            today.isBefore(d.getStartDate()))
                        return false;

                    if (d.getEndDate() != null &&
                            today.isAfter(d.getEndDate()))
                        return false;

                    // ===== INDIVIDUAL =====
                    if ("INDIVIDUAL".equalsIgnoreCase(d.getType())) {

                        if (d.getStudentEmail() == null ||
                                d.getStudentEmail().isBlank())
                            return false;

                        String[] emails =
                                d.getStudentEmail().split(",");

                        for (String e : emails) {
                            if (e.trim().equalsIgnoreCase(email)) {
                                return true;
                            }
                        }

                        return false;
                    }

                    // ===== GROUP =====
                    if ("GROUP".equalsIgnoreCase(d.getType())) {

                        if (d.getStudentEmail() == null ||
                                d.getStudentEmail().isBlank()) {
                            return true;
                        }

                        String[] emails =
                                d.getStudentEmail().split(",");

                        for (String e : emails) {
                            if (e.trim().equalsIgnoreCase(email)) {
                                return true;
                            }
                        }

                        return false;
                    }

                    // ===== LOYALTY  🔥 FIX ADDED =====
                    if ("LOYALTY".equalsIgnoreCase(d.getType())) {

                        // Student must have previous APPROVED registration
                        boolean hasPrevious =
                                regRepo.existsByEmailAndStatus(email, "APPROVED");

                        return hasPrevious;
                    }

                    // EARLY_BIRD and other open discounts
                    return true;
                })

                .map(d -> new DiscountDTO(
                        d.getId(),
                        d.getName(),
                        d.getType(),
                        d.getDescription(),
                        d.getValue(),
                        d.getMode(),
                        d.getStartDate(),
                        d.getEndDate()
                ))
                .toList();
    }

    // ================= ADMIN VIEW =================

    public List<DiscountDTO> getDiscountsByBatchForAdmin(int batchId) {

        LocalDate today = LocalDate.now();

        List<Discount> discounts =
                discountRepo.findByBatch_Id(batchId);

        return discounts.stream()

                .filter(d -> {

                    if (d.getStartDate() != null &&
                            today.isBefore(d.getStartDate()))
                        return false;

                    if (d.getEndDate() != null &&
                            today.isAfter(d.getEndDate()))
                        return false;

                    return true;
                })

                .map(d -> new DiscountDTO(
                        d.getId(),
                        d.getName(),
                        d.getType(),
                        d.getDescription(),
                        d.getValue(),
                        d.getMode(),
                        d.getStartDate(),
                        d.getEndDate()
                ))
                .toList();
    }

    // ================= BEST DISCOUNT =================

    public BestDiscountResult getBestDiscount(
            int batchId,
            String email) {

        Batch batch = batchRepo.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Batch not found"));

        ModularBatchRegistration reg =
                new ModularBatchRegistration();

        reg.setBatch(batch);
        reg.setEmail(email);
        reg.setOriginalFee(batch.getFee());

        List<Discount> discounts =
                discountRepo.findByBatch_Id(batchId);

        Discount best = null;
        double max = 0;

        for (Discount d : discounts) {

            double current =
                    discountEngine.calculateDiscount(reg, d);

            if (current > max) {
                max = current;
                best = d;
            }
        }

        if (best == null)
            return null;

        return new BestDiscountResult(
                best.getId(),
                best.getName(),
                best.getType(),
                best.getValue(),
                best.getMode(),
                max,
                best.getStartDate(),
                best.getEndDate()
        );
    }
}
