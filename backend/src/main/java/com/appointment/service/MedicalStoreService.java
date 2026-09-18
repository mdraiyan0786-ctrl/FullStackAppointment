package com.appointment.service;

import com.appointment.dto.MedicalStoreRegistrationRequest;
import com.appointment.dto.StoreAdminLoginResponse;
import com.appointment.entity.MedicalStore;
import com.appointment.entity.StoreDoctorSchedule;
import com.appointment.entity.User;
import com.appointment.repository.MedicalStoreRepository;
import com.appointment.repository.StoreDoctorScheduleRepository;
import com.appointment.repository.UserRepository;
import com.appointment.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.appointment.entity.DoctorStoreRequest;
import com.appointment.repository.DoctorStoreRequestRepository;


import javax.swing.*;
import java.util.List;

@Service
public class MedicalStoreService {

    private final MedicalStoreRepository medicalStoreRepository;
    private final StoreDoctorScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DoctorStoreRequestRepository doctorStoreRequestRepository;

    public MedicalStoreService(
            MedicalStoreRepository medicalStoreRepository,
            StoreDoctorScheduleRepository scheduleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            DoctorStoreRequestRepository doctorStoreRequestRepository) {

        this.medicalStoreRepository = medicalStoreRepository;
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.doctorStoreRequestRepository =
                doctorStoreRequestRepository;
    }

    // ==========================================
    // REGISTER MEDICAL STORE
    // ==========================================

    public MedicalStore registerMedicalStore(
            MedicalStoreRegistrationRequest request) {

        // -------------------------
        // VALIDATION
        // -------------------------

        if (request.adminName() == null ||
                request.adminName().trim().isEmpty()) {

            throw new RuntimeException("Admin name is required");
        }

        if (request.email() == null ||
                request.email().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (request.password() == null ||
                request.password().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        if (request.phone() == null ||
                request.phone().trim().isEmpty()) {

            throw new RuntimeException("Phone is required");
        }

        if (request.storeName() == null ||
                request.storeName().trim().isEmpty()) {

            throw new RuntimeException("Store name is required");
        }

        if (request.address() == null ||
                request.address().trim().isEmpty()) {

            throw new RuntimeException("Store address is required");
        }

        if (request.storePhone() == null ||
                request.storePhone().trim().isEmpty()) {

            throw new RuntimeException("Store phone is required");
        }

        if (request.openingTime() == null ||
                request.openingTime().trim().isEmpty()) {

            throw new RuntimeException("Opening time is required");
        }

        if (request.closingTime() == null ||
                request.closingTime().trim().isEmpty()) {

            throw new RuntimeException("Closing time is required");
        }

        // -------------------------
        // CHECK DUPLICATES
        // -------------------------

        String email = request.email().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        String phone = request.phone().trim();

        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone already registered");
        }

        if (medicalStoreRepository
                .existsByNameIgnoreCase(request.storeName().trim())) {

            throw new RuntimeException("Medical store already exists");
        }

        // -------------------------
        // CREATE STORE ADMIN
        // -------------------------

        User admin = new User();

        admin.setName(request.adminName().trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setPhone(phone);
        admin.setRole("STORE_ADMIN");

        User savedAdmin = userRepository.save(admin);

        // -------------------------
        // CREATE MEDICAL STORE
        // -------------------------

        MedicalStore store = new MedicalStore();

        store.setName(request.storeName().trim());
        store.setAddress(request.address().trim());
        store.setPhone(request.storePhone().trim());

        if (request.description() != null) {
            store.setDescription(request.description().trim());
        }

        store.setOpeningTime(request.openingTime().trim());
        store.setClosingTime(request.closingTime().trim());

        store.setAdmin(savedAdmin);

        // New stores require verification
        store.setStatus("PENDING");

        return medicalStoreRepository.save(store);
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
    // GET MEDICAL STORE BY ID
    // ==========================================

    public MedicalStore getStoreById(Long id) {

        return medicalStoreRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medical store not found"));
    }

    // ==========================================
    // GET DOCTORS + SCHEDULES AT STORE
    // ==========================================

    public List<StoreDoctorSchedule> getStoreDoctorSchedules(
            Long storeId) {

        medicalStoreRepository.findById(storeId)
                .orElseThrow(() ->
                        new RuntimeException("Medical store not found"));

        return scheduleRepository.findByMedicalStoreId(storeId);
    }

    public MedicalStore getMyStore(String email){

        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));

        if (!"STORE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException(
                    "Only store admins can access this endpoint"
            );
        }

        return medicalStoreRepository.findByAdminId(user.getId())
                .orElseThrow(()->new RuntimeException(
                        "No medical store found for this admin"
                ));
    }

    public StoreAdminLoginResponse loginStoreAdmin(
            String email,
            String password) {

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (password == null || password.isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        User admin = userRepository.findByEmail(email.trim())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!"STORE_ADMIN".equalsIgnoreCase(admin.getRole())) {
            throw new RuntimeException(
                    "This account is not a medical store account");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        MedicalStore store = medicalStoreRepository
                .findByAdminId(admin.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "No medical store found for this account"));

        String token = jwtService.generateToken(
                admin.getEmail(),
                "STORE_ADMIN"
        );

        return new StoreAdminLoginResponse(
                token,
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getRole(),
                store.getId(),
                store.getName()
        );
    }

    public List<DoctorStoreRequest> getApprovedDoctors(
            Long storeId) {

        medicalStoreRepository.findById(storeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical store not found"
                        ));

        return doctorStoreRequestRepository
                .findByMedicalStoreIdAndStatus(
                        storeId,
                        "APPROVED"
                );
    }
}