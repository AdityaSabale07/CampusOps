package com.campusops.discount;

import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("SUPER_OFFER")
public class SuperOfferDiscountStrategy
        implements DiscountStrategy {

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        // always eligible
        return 1;
    }
}