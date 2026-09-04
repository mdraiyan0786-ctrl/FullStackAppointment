package com.appointment.repository;

import com.appointment.entity.MedicalStore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalStoreRepository
        extends JpaRepository<MedicalStore, Long> {
    // Search stores by name
    List<MedicalStore> findByNameContainingIgnoreCase(String name);

    Optional<MedicalStore> findByAdminId(Long adminId);

    boolean existsByNameIgnoreCase(String name);
}