package com.appointment.controller;

import com.appointment.entity.MedicalStore;
import com.appointment.entity.StoreDoctorSchedule;
import com.appointment.service.MedicalStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-stores")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalStoreController {

    private final MedicalStoreService medicalStoreService;

    public MedicalStoreController(MedicalStoreService medicalStoreService) {
        this.medicalStoreService = medicalStoreService;
    }
    // ==========================================
    // GET ALL MEDICAL STORES
    // ==========================================
    @GetMapping
    public ResponseEntity<List<MedicalStore>> getAllStores() {

        return ResponseEntity.ok(
                medicalStoreService.getAllStores()
        );
    }

    // ==========================================
    // SEARCH MEDICAL STORES
    // ==========================================
    @GetMapping("/search")
    public ResponseEntity<List<MedicalStore>> searchStores(@RequestParam String name){
        return ResponseEntity.ok(
                medicalStoreService.searchStores(name)
        );
    }

    // ==========================================
    // GET MEDICAL STORE BY ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<MedicalStore> getStoreById(@PathVariable Long id){
        return ResponseEntity.ok(medicalStoreService.getStoreById(id));
    }

    // ==========================================
    // GET DOCTORS + SCHEDULES AT A STORE
    // ==========================================

    @GetMapping("/{storeId}/doctors")
    public ResponseEntity<List<StoreDoctorSchedule>>
    getStoreDoctorSchedules(
            @PathVariable Long storeId) {

        return ResponseEntity.ok(
                medicalStoreService
                        .getStoreDoctorSchedules(storeId)
        );

    }

}
