package com.campusops.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("COMBO")
public class ComboBatchDiscountStrategy implements DiscountStrategy {

    @Autowired
    private ModularBatchRegistrationRepository regRepo;

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        // check if student completed previous course
        boolean hasPrevious =
                regRepo.existsByEmailAndStatus(
                        reg.getEmail(),
                        "APPROVED");

        if (hasPrevious)
            return 1; // eligible

        return 0;
    }
}