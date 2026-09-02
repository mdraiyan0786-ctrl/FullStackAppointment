package com.appointment.controller;

import com.appointment.service.PasswordResetOtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {

    private final PasswordResetOtpService passwordResetOtpService;

    public ForgotPasswordController(
            PasswordResetOtpService passwordResetOtpService) {

        this.passwordResetOtpService = passwordResetOtpService;
    }

    @PostMapping("/request-otp")
    @Transactional
    public ResponseEntity<?> requestOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        try {

            passwordResetOtpService.requestOtp(email.trim());

            return ResponseEntity.ok(
                    Map.of("message", "OTP sent successfully")
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP is required"));
        }

        try {

            String resetToken =
                    passwordResetOtpService.verifyOtp(
                            email.trim(),
                            otp.trim()
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "OTP verified successfully",
                            "resetToken", resetToken
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        String resetToken = request.get("resetToken");
        String newPassword = request.get("newPassword");

        if (resetToken == null || resetToken.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Reset token is required"));
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "New password is required"));
        }

        try {

            passwordResetOtpService.resetPassword(
                    resetToken.trim(),
                    newPassword
            );

            return ResponseEntity.ok(
                    Map.of("message", "Password reset successfully")
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}