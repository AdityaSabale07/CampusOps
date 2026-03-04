package com.campusops.discount;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;
import com.campusops.models.BestDiscountResult;

@Component
public class DiscountEngine {

    @Autowired
    private Map<String, DiscountStrategy> strategies;

    // ================= VALIDATION =================

    public boolean isValidDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        LocalDate today = LocalDate.now();

        // ===== DATE VALIDATION =====
        if (discount.getStartDate() != null &&
                today.isBefore(discount.getStartDate())) {
            return false;
        }

        if (discount.getEndDate() != null &&
                today.isAfter(discount.getEndDate())) {
            return false;
        }

        // ===== BATCH VALIDATION =====
        if (discount.getBatch() != null &&
                reg.getBatch() != null &&
                discount.getBatch().getId() != reg.getBatch().getId()) {
            return false;
        }

        // ================= STUDENT VALIDATION (FINAL FIX) =================
        // GROUP + INDIVIDUAL must have email list
        // COMBO handled by strategy

        String type = discount.getType();

        if ("GROUP".equalsIgnoreCase(type)
                || "INDIVIDUAL".equalsIgnoreCase(type)) {

            // email list must exist
            if (discount.getStudentEmail() == null
                    || discount.getStudentEmail().isBlank()) {
                return false;
            }

            if (reg.getEmail() == null) {
                return false;
            }

            String[] emails =
                    discount.getStudentEmail().split(",");

            boolean matched = false;

            for (String e : emails) {
                if (e.trim()
                        .equalsIgnoreCase(reg.getEmail())) {
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                return false;
            }
        }

        return true;
    }

    // ================= COMMON AMOUNT CALCULATION =================

    private double calculateAmount(
            ModularBatchRegistration reg,
            Discount discount,
            double rawValue) {

        // strategy not applicable
        if (rawValue <= 0)
            return 0;

        // MODE = PERCENTAGE
        if ("PERCENTAGE".equalsIgnoreCase(discount.getMode())) {
            return reg.getOriginalFee()
                    * discount.getValue() / 100;
        }

        // MODE = FLAT
        return Math.min(
                discount.getValue(),
                reg.getOriginalFee()
        );
    }

    // ================= SINGLE DISCOUNT =================

    public double calculateDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

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

        System.out.println("⚙ Applying Strategy: "
                + discount.getType());

        double raw =
                strategy.applyDiscount(reg, discount);

        return calculateAmount(reg, discount, raw);
    }

    // ================= BEST DISCOUNT =================

    public double findBestDiscount(
            ModularBatchRegistration reg,
            Iterable<Discount> discounts) {

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

            double raw =
                    strategy.applyDiscount(reg, discount);

            double current =
                    calculateAmount(reg, discount, raw);

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

    // ================= BEST DISCOUNT INFO =================

    public BestDiscountResult findBestDiscountInfo(
            ModularBatchRegistration reg,
            Iterable<Discount> discounts) {

        double maxDiscount = 0;
        Discount best = null;

        for (Discount discount : discounts) {

            if (!isValidDiscount(reg, discount)) {
                continue;
            }

            DiscountStrategy strategy =
                    strategies.get(
                            discount.getType().toUpperCase());

            if (strategy == null)
                continue;

            double raw =
                    strategy.applyDiscount(reg, discount);

            double current =
                    calculateAmount(reg, discount, raw);

            if (current > maxDiscount) {
                maxDiscount = current;
                best = discount;
            }
        }

        if (best == null) {
            return null;
        }

        return new BestDiscountResult(
                best.getId(),
                best.getName(),
                best.getType(),
                best.getValue(),
                best.getMode(),
                maxDiscount,
                best.getStartDate(),
                best.getEndDate()
        );
    }
}













//package com.campusops.discount;
//
//import java.time.LocalDate;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import com.campusops.entities.Discount;
//import com.campusops.entities.ModularBatchRegistration;
//import com.campusops.models.BestDiscountResult;
//
//@Component
//public class DiscountEngine {
//
//    @Autowired
//    private Map<String, DiscountStrategy> strategies;
//
//    // ================= VALIDATION =================
//
//    public boolean isValidDiscount(
//            ModularBatchRegistration reg,
//            Discount discount) {
//
//        LocalDate today = LocalDate.now();
//
//        // DATE VALIDATION
//        if (discount.getStartDate() != null &&
//                today.isBefore(discount.getStartDate())) {
//            return false;
//        }
//
//        if (discount.getEndDate() != null &&
//                today.isAfter(discount.getEndDate())) {
//            return false;
//        }
//
//        // BATCH VALIDATION
//        if (discount.getBatch() != null &&
//                reg.getBatch() != null &&
//                discount.getBatch().getId() !=(reg.getBatch().getId())) {
//            return false;
//        }
//
//        // STUDENT VALIDATION
//        if (discount.getStudentEmail() != null &&
//                reg.getEmail() != null &&
//                !discount.getStudentEmail()
//                        .equalsIgnoreCase(reg.getEmail())) {
//            return false;
//        }
//
//        return true;
//    }
//
//    // ================= COMMON AMOUNT CALCULATION =================
//
//    private double calculateAmount(
//            ModularBatchRegistration reg,
//            Discount discount,
//            double rawValue) {
//
//        // If strategy says not applicable
//        if (rawValue <= 0)
//            return 0;
//
//        // MODE = PERCENTAGE
//        if ("PERCENTAGE".equalsIgnoreCase(discount.getMode())) {
//            return reg.getOriginalFee()
//                    * discount.getValue() / 100;
//        }
//
//        // MODE = FLAT (safe protection)
//        return Math.min(discount.getValue(),
//                reg.getOriginalFee());
//    }
//
//    // ================= SINGLE DISCOUNT =================
//
//    public double calculateDiscount(
//            ModularBatchRegistration reg,
//            Discount discount) {
//
//        if (!isValidDiscount(reg, discount)) {
//            return 0;
//        }
//
//        DiscountStrategy strategy =
//                strategies.get(
//                        discount.getType().toUpperCase()
//                );
//
//        if (strategy == null) {
//            System.out.println("❌ Strategy NOT FOUND: "
//                    + discount.getType());
//            return 0;
//        }
//
//        System.out.println("⚙ Applying Strategy: "
//                + discount.getType());
//
//        double raw =
//                strategy.applyDiscount(reg, discount);
//
//        return calculateAmount(reg, discount, raw);
//    }
//
//    // ================= BEST DISCOUNT =================
//
//    public double findBestDiscount(
//            ModularBatchRegistration reg,
//            Iterable<Discount> discounts) {
//
//        double maxDiscount = 0;
//
//        for (Discount discount : discounts) {
//
//            if (!isValidDiscount(reg, discount)) {
//                continue;
//            }
//
//            DiscountStrategy strategy =
//                    strategies.get(
//                            discount.getType().toUpperCase()
//                    );
//
//            if (strategy == null) {
//                System.out.println("❌ Strategy missing for: "
//                        + discount.getType());
//                continue;
//            }
//
//            double raw =
//                    strategy.applyDiscount(reg, discount);
//
//            double current =
//                    calculateAmount(reg, discount, raw);
//
//            System.out.println("✅ Checking discount: "
//                    + discount.getName()
//                    + " = " + current);
//
//            if (current > maxDiscount) {
//                maxDiscount = current;
//            }
//        }
//
//        System.out.println("🔥 BEST DISCOUNT = "
//                + maxDiscount);
//
//        return maxDiscount;
//    }
//    
//    public BestDiscountResult findBestDiscountInfo(
//            ModularBatchRegistration reg,
//            Iterable<Discount> discounts) {
//
//        double maxDiscount = 0;
//        Discount best = null;
//
//        for (Discount discount : discounts) {
//
//            if (!isValidDiscount(reg, discount)) {
//                continue;
//            }
//
//            DiscountStrategy strategy =
//                    strategies.get(
//                            discount.getType().toUpperCase());
//
//            if (strategy == null) continue;
//
//            double current =
//                    strategy.applyDiscount(reg, discount);
//
//            if (current > maxDiscount) {
//                maxDiscount = current;
//                best = discount;
//            }
//        }
//
//        if (best == null) {
//            return null;
//        }
//
//        return new BestDiscountResult(
//                best.getId(),
//                best.getName(),
//                best.getType(),
//                maxDiscount
//        );
//    }
//}