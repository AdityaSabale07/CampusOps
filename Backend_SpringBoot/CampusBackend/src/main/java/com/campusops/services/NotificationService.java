package com.campusops.services;

import org.springframework.stereotype.Service;

import com.campusops.entities.ModularBatchRegistration;

@Service
public class NotificationService {

    // ================= SEND WELCOME =================

    public void sendWelcomeMessage(
            ModularBatchRegistration reg) {

        // For now we just print
        // Later you can integrate Email / SMS

        String message =
                "Hello " + reg.getStudentName()
                + ", Your admission approved. "
                + "Login credentials sent.";

        System.out.println("================================");
        System.out.println("WELCOME NOTIFICATION");
        System.out.println("To : " + reg.getEmail());
        System.out.println(message);
        System.out.println("================================");
    }
}