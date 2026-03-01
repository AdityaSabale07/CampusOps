package com.campusops.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("LOYALTY")
public class LoyaltyDiscountStrategy
        implements DiscountStrategy {

    @Autowired
    private ModularBatchRegistrationRepository regRepo;

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        long previous =
                regRepo.countByEmailAndStatus(
                        reg.getEmail(),
                        "APPROVED");

        // eligible only if student has previous course
        if (previous <= 0)
            return 0;

        return 1; // eligible
    }
}