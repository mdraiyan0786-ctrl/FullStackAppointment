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
    //private final NotificationService notificationService;
    private final DoctorNotificationService doctorNotificationService;

    public DoctorStoreRequestService(
            DoctorStoreRequestRepository requestRepository,
            DoctorRepository doctorRepository,
            MedicalStoreRepository medicalStoreRepository,
            DoctorNotificationService doctorNotificationService) {

        this.requestRepository = requestRepository;
        this.doctorRepository = doctorRepository;
        this.medicalStoreRepository = medicalStoreRepository;
        this.doctorNotificationService = doctorNotificationService;
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
    // ==========================================
// STORE ADMIN VIEW THEIR STORE REQUESTS
// ==========================================

    public List<DoctorStoreRequest> getAdminRequests(
            Long adminId) {

        List<MedicalStore> stores =
                medicalStoreRepository.findAll();

        return stores.stream()
                .filter(store ->
                        store.getAdmin() != null
                                && store.getAdmin().getId().equals(adminId))
                .flatMap(store ->
                        requestRepository
                                .findByMedicalStoreId(store.getId())
                                .stream())
                .toList();
    }

    // ==========================================
// ACCEPT REQUEST
// ==========================================

    // ==========================================
// ACCEPT REQUEST
// ==========================================

    // ==========================================
// ACCEPT REQUEST
// ==========================================

    // ==========================================
// ACCEPT REQUEST
// ==========================================

    public DoctorStoreRequest approveRequest(
            Long requestId,
            Long adminId) {

        DoctorStoreRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store request not found"
                                ));

        MedicalStore medicalStore =
                request.getMedicalStore();


        // ==========================================
        // CHECK STORE ADMIN
        // ==========================================

        if (medicalStore.getAdmin() == null ||
                !medicalStore.getAdmin()
                        .getId()
                        .equals(adminId)) {

            throw new RuntimeException(
                    "You are not authorized to manage this request"
            );
        }


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if (!"PENDING".equalsIgnoreCase(
                request.getStatus())) {

            throw new RuntimeException(
                    "This request has already been processed"
            );
        }


        // ==========================================
        // APPROVE
        // ==========================================

        request.setStatus("APPROVED");

        DoctorStoreRequest savedRequest =
                requestRepository.save(request);


        // ==========================================
        // NOTIFY DOCTOR
        // ==========================================

        Doctor doctor =
                request.getDoctor();

        if (doctor != null) {

            doctorNotificationService.createNotification(
                    doctor,
                    "Your request to work at "
                            + medicalStore.getName()
                            + " has been approved."
            );
        }


        return savedRequest;
    }


// ==========================================
// REJECT REQUEST
// ==========================================

    // ==========================================
// REJECT REQUEST
// ==========================================

    public DoctorStoreRequest rejectRequest(
            Long requestId,
            Long adminId) {

        DoctorStoreRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store request not found"
                                ));

        MedicalStore medicalStore =
                request.getMedicalStore();


        // ==========================================
        // CHECK STORE ADMIN
        // ==========================================

        if (medicalStore.getAdmin() == null ||
                !medicalStore.getAdmin()
                        .getId()
                        .equals(adminId)) {

            throw new RuntimeException(
                    "You are not authorized to manage this request"
            );
        }


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if (!"PENDING".equalsIgnoreCase(
                request.getStatus())) {

            throw new RuntimeException(
                    "This request has already been processed"
            );
        }


        // ==========================================
        // REJECT
        // ==========================================

        request.setStatus("REJECTED");

        DoctorStoreRequest savedRequest =
                requestRepository.save(request);


        // ==========================================
        // NOTIFY DOCTOR
        // ==========================================

        Doctor doctor =
                request.getDoctor();

        if (doctor != null) {

            doctorNotificationService.createNotification(
                    doctor,
                    "Your request to work at "
                            + medicalStore.getName()
                            + " has been rejected."
            );
        }


        return savedRequest;
    }
}