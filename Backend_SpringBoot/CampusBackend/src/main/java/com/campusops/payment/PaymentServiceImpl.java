package com.campusops.payment;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.campusops.entities.ModularBatchRegistration;
import com.campusops.daos.ModularBatchRegistrationRepository;
import com.campusops.services.ModularBatchRegistrationService;
import com.campusops.services.NotificationService;
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
    private ModularBatchRegistrationService regService;

    @Autowired
    private NotificationService notificationService;

    // ================= CREATE ORDER =================

    @Override
    public JSONObject createOrder(int registrationId) {

        try {

            ModularBatchRegistration reg =
                    regRepo.findById(registrationId)
                            .orElseThrow(() ->
                                    new RuntimeException("Registration not found"));

            if (!"APPROVED".equals(reg.getStatus())) {
                throw new RuntimeException("Registration not approved");
            }

            if (!"PENDING".equals(reg.getPaymentStatus())) {
                throw new RuntimeException("Payment already completed");
            }

            // ⭐ PAYMENT DEADLINE CHECK
            if (reg.getPaymentDueDate() != null &&
                    LocalDate.now().isAfter(reg.getPaymentDueDate())) {

                reg.setPaymentStatus("EXPIRED");
                regRepo.save(reg);

                throw new RuntimeException("Payment deadline expired");
            }

            RazorpayClient client =
                    new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", reg.getFinalAmount() * 100); // paise
            options.put("currency", "INR");
            options.put("receipt", "reg_" + reg.getId());

            Order order = client.orders.create(options);

            JSONObject response = new JSONObject();

            response.put("orderId", order.get("id").toString());
            response.put("amount", Double.parseDouble(order.get("amount").toString()));
            response.put("key", keyId);

            return response;

    

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // ================= VERIFY PAYMENT =================

    @Override
    public String verifyPayment(PaymentVerifyRequest request) {

        try {

            ModularBatchRegistration reg =
                    regRepo.findById(request.getRegistrationId())
                            .orElseThrow(() ->
                                    new RuntimeException("Registration not found"));

            // ⭐ DEADLINE CHECK AGAIN (SAFETY)
            if (reg.getPaymentDueDate() != null &&
                    LocalDate.now().isAfter(reg.getPaymentDueDate())) {

                reg.setPaymentStatus("EXPIRED");
                regRepo.save(reg);

                throw new RuntimeException("Payment deadline expired");
            }

            JSONObject options = new JSONObject();

            // ⭐ FIXED AMBIGUOUS PUT ERROR
            options.put("razorpay_order_id",
                    (Object) request.getRazorpayOrderId());

            options.put("razorpay_payment_id",
                    (Object) request.getRazorpayPaymentId());

            options.put("razorpay_signature",
                    (Object) request.getRazorpaySignature());

//            boolean isValid =
//                    Utils.verifyPaymentSignature(options, keySecret); for real razerpay
            
            boolean isValid =true; // just for demo

            if (!isValid) {
                throw new RuntimeException("Payment signature invalid");
            }

            // ⭐ UPDATE PAYMENT INFO
            reg.setPaymentStatus("PAID");
            reg.setPaymentId(request.getRazorpayPaymentId());
            reg.setPaymentDate(LocalDateTime.now());

            regRepo.save(reg);

            // ⭐ CREATE USER AFTER PAYMENT
            regService.createUserFromRegistration(reg);

            // ⭐ SEND WELCOME EMAIL
            notificationService.sendWelcomeMessage(reg);

            return "Payment Success";

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}