package com.appointment.service;

import com.appointment.entity.MedicalStore;
import com.appointment.entity.StoreDoctorSchedule;
import com.appointment.repository.MedicalStoreRepository;
import com.appointment.repository.StoreDoctorScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalStoreService {

    private final MedicalStoreRepository medicalStoreRepository;
    private final StoreDoctorScheduleRepository scheduleRepository;

    public MedicalStoreService(
            MedicalStoreRepository medicalStoreRepository,
            StoreDoctorScheduleRepository scheduleRepository) {

        this.medicalStoreRepository = medicalStoreRepository;
        this.scheduleRepository = scheduleRepository;
    }


    // ==========================================
    // GET ALL MEDICAL STORES
    // ==========================================

    public List<MedicalStore> getAllStores() {

        return medicalStoreRepository.findAll();
    }


    // ==========================================
    // SEARCH MEDICAL STORES
    // ==========================================

    public List<MedicalStore> searchStores(String name) {

        if (name == null || name.trim().isEmpty()) {

            return medicalStoreRepository.findAll();
        }

        return medicalStoreRepository
                .findByNameContainingIgnoreCase(name.trim());
    }


    // ==========================================
    // GET STORE BY ID
    // ==========================================

    public MedicalStore getStoreById(Long id) {

        return medicalStoreRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical store not found"
                        ));
    }


    // ==========================================
    // GET DOCTORS AND THEIR SCHEDULES
    // FOR A MEDICAL STORE
    // ==========================================

    public List<StoreDoctorSchedule> getStoreDoctorSchedules(
            Long storeId) {

        // Make sure the store exists
        medicalStoreRepository
                .findById(storeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical store not found"
                        ));

        return scheduleRepository
                .findByMedicalStoreId(storeId);
    }
}