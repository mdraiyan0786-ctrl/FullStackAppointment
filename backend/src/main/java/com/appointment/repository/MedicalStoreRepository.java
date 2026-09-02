package com.appointment.repository;

import com.appointment.entity.MedicalStore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalStoreRepository
        extends JpaRepository<MedicalStore, Long> {
    // Search stores by name
    List<MedicalStore> findByNameContainingIgnoreCase(String name);
}