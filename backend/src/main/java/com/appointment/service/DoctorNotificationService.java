package com.appointment.service;

import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorNotification;
import com.appointment.repository.DoctorNotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorNotificationService {

    private final DoctorNotificationRepository
            notificationRepository;


    public DoctorNotificationService(
            DoctorNotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    public DoctorNotification createNotification(
            Doctor doctor,
            String message) {

        DoctorNotification notification =
                new DoctorNotification();

        notification.setDoctor(doctor);
        notification.setMessage(message);
        notification.setRead(false);

        return notificationRepository.save(
                notification
        );
    }


    // ==========================================
    // GET DOCTOR NOTIFICATIONS
    // ==========================================

    public List<DoctorNotification> getMyNotifications(
            Long doctorId) {

        return notificationRepository
                .findByDoctorIdOrderByCreatedAtDesc(
                        doctorId
                );
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    public long getUnreadCount(Long doctorId) {

        return notificationRepository
                .countByDoctorIdAndIsReadFalse(
                        doctorId
                );
    }


    // ==========================================
    // MARK AS READ
    // ==========================================

    public void markAsRead(
            Long notificationId,
            Long doctorId) {

        DoctorNotification notification =
                notificationRepository
                        .findByIdAndDoctorId(
                                notificationId,
                                doctorId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        notificationRepository.save(
                notification
        );
    }
}