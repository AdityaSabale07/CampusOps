package com.campusops.payment;

import org.json.JSONObject;

public interface PaymentService {

    JSONObject createOrder(Long registrationId);

    String verifyPayment(PaymentVerifyRequest request);
}