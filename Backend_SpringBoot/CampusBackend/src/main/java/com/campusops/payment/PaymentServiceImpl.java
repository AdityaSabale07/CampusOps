package com.campusops.payment;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.campusops.entities.ModularBatchRegistration;
import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.services.NotificationService;
import com.campusops.services.UserAccountService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private ModularBatchRegistrationRepository regRepo;

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public JSONObject createOrder(Long registrationId) {

        try {

            ModularBatchRegistration reg =
                    regRepo.findById(registrationId)
                    .orElseThrow(() -> new RuntimeException("Registration not found"));

            if (!"APPROVED".equals(reg.getStatus())) {
                throw new RuntimeException("Registration not approved");
            }

            if (!"PENDING".equals(reg.getPaymentStatus())) {
                throw new RuntimeException("Payment already completed");
            }

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", reg.getFinalAmount() * 100); // paise
            options.put("currency", "INR");
            options.put("receipt", "reg_" + reg.getId());

            Order order = client.orders.create(options);

            JSONObject response = new JSONObject();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("key", keyId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public String verifyPayment(PaymentVerifyRequest request) {

        try {

            ModularBatchRegistration reg =
                    regRepo.findById(request.getRegistrationId())
                    .orElseThrow(() -> new RuntimeException("Registration not found"));

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid =
                    Utils.verifyPaymentSignature(options, keySecret);

            if (!isValid) {
                throw new RuntimeException("Payment signature invalid");
            }

            // ⭐ Update payment info
            reg.setPaymentStatus("PAID");
            reg.setPaymentId(request.getRazorpayPaymentId());
            reg.setPaymentDate(LocalDateTime.now());

            regRepo.save(reg);

            // ⭐ CREATE USER AFTER PAYMENT
            userAccountService.createUserFromRegistration(reg);

            // ⭐ SEND WELCOME EMAIL
            notificationService.sendWelcomeMessage(reg);

            return "Payment Success";

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}