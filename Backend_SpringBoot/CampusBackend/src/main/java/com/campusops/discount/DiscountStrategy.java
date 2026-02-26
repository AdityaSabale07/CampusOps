package com.campusops.discount;

import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

public interface DiscountStrategy {

    double applyDiscount( ModularBatchRegistration reg,Discount discount);
}