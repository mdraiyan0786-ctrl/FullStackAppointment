package com.appointment.service;

import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorStoreRequest;
import com.appointment.entity.MedicalStore;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.DoctorStoreRequestRepository;
import com.appointment.repository.MedicalStoreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DoctorStoreRequestService {

    private final DoctorStoreRequestRepository requestRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalStoreRepository medicalStoreRepository;

    public DoctorStoreRequestService(
            DoctorStoreRequestRepository requestRepository,
            DoctorRepository doctorRepository,
            MedicalStoreRepository medicalStoreRepository) {

        this.requestRepository = requestRepository;
        this.doctorRepository = doctorRepository;
        this.medicalStoreRepository = medicalStoreRepository;
    }

    // ==========================================
    // SEND REQUEST
    // ==========================================

    public DoctorStoreRequest sendRequest(
            String doctorEmail,
            Long medicalStoreId) {

        // Find doctor from JWT email
        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        // Find store
        MedicalStore medicalStore =
                medicalStoreRepository.findById(medicalStoreId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical store not found"
                                ));

        // Store must be approved
        if (!"APPROVED".equalsIgnoreCase(
                medicalStore.getStatus())) {

            throw new RuntimeException(
                    "This medical store is not approved"
            );
        }

        // Check whether a request already exists
        var existingRequest =
                requestRepository
                        .findByDoctorIdAndMedicalStoreId(
                                doctor.getId(),
                                medicalStore.getId()
                        );

        if (existingRequest.isPresent()) {

            DoctorStoreRequest request =
                    existingRequest.get();

            if ("PENDING".equalsIgnoreCase(
                    request.getStatus())) {

                throw new RuntimeException(
                        "Request already pending"
                );
            }

            if ("APPROVED".equalsIgnoreCase(
                    request.getStatus())) {

                throw new RuntimeException(
                        "Doctor is already associated with this store"
                );
            }

            // REJECTED request can be sent again
            request.setStatus("PENDING");
            request.setRequestedAt(LocalDateTime.now());

            return requestRepository.save(request);
        }

        // Create new request
        DoctorStoreRequest request =
                new DoctorStoreRequest();

        request.setDoctor(doctor);
        request.setMedicalStore(medicalStore);
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());

        return requestRepository.save(request);
    }

    // ==========================================
    // GET DOCTOR'S REQUESTS
    // ==========================================

    public List<DoctorStoreRequest> getMyRequests(
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        return requestRepository.findByDoctorId(
                doctor.getId()
        );
    }
}