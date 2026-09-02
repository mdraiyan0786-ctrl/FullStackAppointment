package com.appointment.repository;

import com.appointment.entity.StoreDoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreDoctorScheduleRepository
        extends JpaRepository<StoreDoctorSchedule, Long> {

    // Get all doctor schedules for a medical store
    List<StoreDoctorSchedule> findByMedicalStoreId(Long medicalStoreId);

    // Get all schedules for a particular doctor
    List<StoreDoctorSchedule> findByDoctorId(Long doctorId);

    // Get schedules for a particular doctor at a particular store
    List<StoreDoctorSchedule> findByMedicalStoreIdAndDoctorId(
            Long medicalStoreId,
            Long doctorId
    );
}