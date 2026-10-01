package com.appointment.repository;

import com.appointment.entity.DoctorNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorNotificationRepository
        extends JpaRepository<DoctorNotification, Long> {

    List<DoctorNotification>
    findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    long countByDoctorIdAndIsReadFalse(Long doctorId);

    Optional<DoctorNotification>
    findByIdAndDoctorId(Long id, Long doctorId);
}