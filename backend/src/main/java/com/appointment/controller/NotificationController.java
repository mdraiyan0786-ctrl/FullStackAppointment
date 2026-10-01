package com.appointment.controller;

import com.appointment.entity.Notification;
import com.appointment.entity.User;
import com.appointment.repository.UserRepository;
import com.appointment.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {

        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // Get logged-in user's notifications
    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        return ResponseEntity.ok(
                notificationService.getMyNotifications(user.getId())
        );
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found"));

        long count =
                notificationService.getUnreadCount(user.getId());

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long id,Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(
                ()->new RuntimeException("User Not Found"));
        notificationService.markAsRead(
                id,
                user.getId()
        );
        return ResponseEntity.ok(
                "Notification marked as read"
        );
    }
    @GetMapping("/store-admin")
    @PreAuthorize("hasRole('STORE_ADMIN')")
    public ResponseEntity<List<Notification>> getStoreAdminNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return ResponseEntity.ok(
                notificationService.getMyNotifications(user.getId())
        );
    }

    @GetMapping("/store-admin/unread-count")
    @PreAuthorize("hasRole('STORE_ADMIN')")
    public ResponseEntity<Long> getStoreAdminUnreadCount(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return ResponseEntity.ok(
                notificationService.getUnreadCount(user.getId())
        );
    }

    @PutMapping("/store-admin/{id}/read")
    @PreAuthorize("hasRole('STORE_ADMIN')")
    public ResponseEntity<String> markStoreAdminNotificationAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        notificationService.markAsRead(id, user.getId());

        return ResponseEntity.ok(
                "Notification marked as read"
        );
    }
}