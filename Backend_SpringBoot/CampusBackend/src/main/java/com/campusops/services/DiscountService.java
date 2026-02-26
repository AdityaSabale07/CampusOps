package com.campusops.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.BatchRepository;
import com.campusops.daos.DiscountRepository;
import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.entities.Batch;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;
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

    // ================= GET DISCOUNTS BY BATCH =================

    public List<DiscountDTO> getDiscountsByBatch(int batchId, String email) {

        LocalDate today = LocalDate.now();

        List<Discount> discounts =
                discountRepo.findByBatch_Id(batchId);

        return discounts.stream()

                .filter(d -> {
                    if (d.getStartDate() == null ||
                        d.getEndDate() == null)
                        return true;

                    return !today.isBefore(d.getStartDate())
                            && !today.isAfter(d.getEndDate());
                })

                .map(d -> new DiscountDTO(
                        d.getId(),
                        d.getName(),
                        d.getType(),
                        d.getValue(),
                        d.getStartDate(),
                        d.getEndDate()
                ))
                .toList();
    }
}