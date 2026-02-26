package com.campusops.discount;

import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("PERCENTAGE")
public class PercentageDiscountStrategy
        implements DiscountStrategy {

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        return reg.getOriginalFee()
                * discount.getValue() / 100;
    }
}