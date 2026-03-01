package com.campusops.discount;

import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("INDIVIDUAL")
public class IndividualDiscountStrategy
        implements DiscountStrategy {

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        // Student validation already handled
        // in DiscountEngine

        return 1; // eligible
    }
}