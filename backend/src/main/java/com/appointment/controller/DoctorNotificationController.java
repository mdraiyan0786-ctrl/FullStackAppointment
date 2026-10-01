package com.appointment.controller;

import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorNotification;
import com.appointment.repository.DoctorRepository;
import com.appointment.service.DoctorNotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorNotificationController {

    private final DoctorNotificationService doctorNotificationService;
    private final DoctorRepository doctorRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public DoctorNotificationController(
            DoctorNotificationService doctorNotificationService,
            DoctorRepository doctorRepository) {

        this.doctorNotificationService =
                doctorNotificationService;

        this.doctorRepository =
                doctorRepository;
    }


    // ==========================================
    // GET MY NOTIFICATIONS
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<List<DoctorNotification>>
    getMyNotifications(
            Authentication authentication) {

        String email =
                authentication.getName();

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        return ResponseEntity.ok(
                doctorNotificationService
                        .getMyNotifications(
                                doctor.getId()
                        )
        );
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    @GetMapping("/unread-count")
    public ResponseEntity<Long>
    getUnreadCount(
            Authentication authentication) {

        String email =
                authentication.getName();

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        return ResponseEntity.ok(
                doctorNotificationService
                        .getUnreadCount(
                                doctor.getId()
                        )
        );
    }


    // ==========================================
    // MARK AS READ
    // ==========================================

    @PutMapping("/{id}/read")
    public ResponseEntity<String>
    markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        String email =
                authentication.getName();

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        doctorNotificationService.markAsRead(
                id,
                doctor.getId()
        );

        return ResponseEntity.ok(
                "Notification marked as read"
        );
    }
}