package com.campusops.discount;

import org.springframework.stereotype.Component;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("FLAT")
public class FlatDiscountStrategy implements DiscountStrategy {

    @Override
    public double applyDiscount( ModularBatchRegistration reg, Discount discount) {
return discount.getValue();
    }
}