package com.campusops.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.entities.Discount;
import com.campusops.entities.ModularBatchRegistration;

@Component("GROUP")
public class GroupDiscountStrategy implements DiscountStrategy {

    @Autowired
    private ModularBatchRegistrationRepository regRepo;

    @Override
    public double applyDiscount(
            ModularBatchRegistration reg,
            Discount discount) {

        long count =
                regRepo.countByBatchId(
                        reg.getBatch().getId());

        if (count >= 3) {
            return reg.getOriginalFee()
                    * discount.getValue() / 100;
        }

        return 0;
    }
}