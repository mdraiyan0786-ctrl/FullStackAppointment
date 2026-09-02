package com.appointment.repository;

import com.appointment.entity.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorReviewRepository extends JpaRepository<DoctorReview,Long> {
    List<DoctorReview> findByDoctorIdOrderByCreatedAtDesc(
            Long doctorId
    );

    Optional<DoctorReview> findByAppointmentId(
            Long appointmentId
    );

    boolean existsByAppointmentId(
            Long appointmentId
    );

    long countByDoctorId(
            Long doctorId
    );

}
