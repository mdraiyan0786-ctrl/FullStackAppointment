package com.appointment.service;

import com.appointment.entity.Notification;
import com.appointment.entity.User;
import com.appointment.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // ============================================================
    // CREATE NOTIFICATION
    // ============================================================

    public Notification createNotification(User user , String message){
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUser(user);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    // ============================================================
    // GET LOGGED-IN USER'S NOTIFICATIONS
    // ============================================================

    public List<Notification> getMyNotifications(Long userId){
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ============================================================
    // GET UNREAD NOTIFICATION COUNT
    // ============================================================

    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    // ============================================================
    // MARK NOTIFICATION AS READ
    // ============================================================

    public void markAsRead(Long notificationId, Long userId) {

        Notification notification =
                notificationRepository
                        .findByIdAndUserId(notificationId, userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        notificationRepository.save(notification);
    }
}