package com.campusops.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order/{registrationId}")
    public String createOrder(@PathVariable Long registrationId) {

        JSONObject order = paymentService.createOrder(registrationId);
        return order.toString();
    }

    @PostMapping("/verify")
    public String verifyPayment(@RequestBody PaymentVerifyRequest request) {
        return paymentService.verifyPayment(request);
    }
}