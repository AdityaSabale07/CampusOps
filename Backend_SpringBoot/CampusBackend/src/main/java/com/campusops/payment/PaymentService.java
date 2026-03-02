package com.campusops.payment;

import org.json.JSONObject;

public interface PaymentService {

    JSONObject createOrder(int registrationId);

    String verifyPayment(PaymentVerifyRequest request);
}