package com.campusops.discount;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component
public class DiscountEngine {

    @Autowired
    private Map<String, DiscountStrategy> strategies;

    // ================= VALIDATION =================

    public boolean isValidDiscount(ModularBatchRegistration reg,Discount discount) {

        LocalDate today = LocalDate.now();

        // DATE VALIDATION
        if (discount.getStartDate() != null &&
                today.isBefore(discount.getStartDate())) {
            return false;
        }

        if (discount.getEndDate() != null &&
                today.isAfter(discount.getEndDate())) {
            return false;
        }

        // BATCH VALIDATION
        if (discount.getBatch() != null &&
                reg.getBatch() != null &&
                discount.getBatch().getId() !=
                reg.getBatch().getId()) {
            return false;
        }

        // STUDENT VALIDATION
        if (discount.getStudentEmail() != null &&
                reg.getEmail() != null &&
                !discount.getStudentEmail()
                        .equalsIgnoreCase(reg.getEmail())) {
            return false;
        }

        return true;
    }

    // ================= SINGLE DISCOUNT =================

    public double calculateDiscount(  ModularBatchRegistration reg,  Discount discount) {

        if (!isValidDiscount(reg, discount)) {
            return 0;
        }

        DiscountStrategy strategy =
                strategies.get(
                        discount.getType().toUpperCase()
                );

        if (strategy == null) {
            System.out.println("❌ Strategy NOT FOUND: "
                    + discount.getType());
            return 0;
        }

        return strategy.applyDiscount(reg, discount);
    }

    // ================= BEST DISCOUNT =================

    public double findBestDiscount( ModularBatchRegistration reg, Iterable<Discount> discounts) {

        double maxDiscount = 0;

        for (Discount discount : discounts) {

            if (!isValidDiscount(reg, discount)) {
                continue;
            }

            DiscountStrategy strategy =
                    strategies.get(
                        discount.getType().toUpperCase()
                    );

            if (strategy == null) {
                System.out.println("❌ Strategy missing for: "
                        + discount.getType());
                continue;
            }

            double current =
                    strategy.applyDiscount(reg, discount);

            System.out.println("✅ Checking discount: "
                    + discount.getName()
                    + " = " + current);

            if (current > maxDiscount) {
                maxDiscount = current;
            }
        }

        System.out.println("🔥 BEST DISCOUNT = "
                + maxDiscount);

        return maxDiscount;
    }
}