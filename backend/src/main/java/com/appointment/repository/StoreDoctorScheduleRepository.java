
package com.appointment.repository;

import com.appointment.entity.StoreDoctorSchedule;


import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface StoreDoctorScheduleRepository
        extends JpaRepository<StoreDoctorSchedule, Long> {

    // Get all doctor schedules for a medical store
    List<StoreDoctorSchedule> findByMedicalStoreId(Long medicalStoreId);

    // Get all schedules for a particular doctor
    List<StoreDoctorSchedule> findByDoctorId(Long doctorId);

    // Get schedules for a doctor at a particular store
    List<StoreDoctorSchedule> findByMedicalStoreIdAndDoctorId(
            Long medicalStoreId,
            Long doctorId
    );

    // Find and lock the session for booking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM StoreDoctorSchedule s
        WHERE s.medicalStore.id = :storeId
          AND s.doctor.id = :doctorId
          AND s.dayOfWeek = :day
    """)
    Optional<StoreDoctorSchedule> findScheduleForBooking(
            @Param("storeId") Long storeId,
            @Param("doctorId") Long doctorId,
            @Param("day") DayOfWeek day
    );
}
