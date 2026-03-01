package com.campusops.discount;

import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("GROUP")
public class GroupDiscountStrategy implements DiscountStrategy {

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        // Group eligibility handled by DiscountEngine
        // (studentEmail + batch + dates)

        return 1; // eligible
    }
}