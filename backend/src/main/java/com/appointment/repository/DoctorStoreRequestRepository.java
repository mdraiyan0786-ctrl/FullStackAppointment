package com.appointment.repository;

import com.appointment.entity.DoctorStoreRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorStoreRequestRepository
        extends JpaRepository<DoctorStoreRequest, Long> {

    List<DoctorStoreRequest> findByDoctorId(Long doctorId);

    List<DoctorStoreRequest> findByMedicalStoreId(Long medicalStoreId);

    Optional<DoctorStoreRequest> findByDoctorIdAndMedicalStoreId(
            Long doctorId,
            Long medicalStoreId
    );

    List<DoctorStoreRequest> findByDoctorIdAndStatus(
            Long doctorId,
            String status
    );

    List<DoctorStoreRequest> findByMedicalStoreIdAndStatus(
            Long medicalStoreId,
            String status
    );
}