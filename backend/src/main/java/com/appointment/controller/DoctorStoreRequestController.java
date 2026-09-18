package com.appointment.controller;

import com.appointment.entity.DoctorStoreRequest;
import com.appointment.service.DoctorStoreRequestService;
import com.appointment.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor-store-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorStoreRequestController {

    private final DoctorStoreRequestService requestService;
    private final UserRepository userRepository;

    public DoctorStoreRequestController(
            DoctorStoreRequestService requestService,
            UserRepository userRepository) {

        this.requestService = requestService;
        this.userRepository = userRepository;
    }


    // ==========================================
    // SEND STORE REQUEST
    // ==========================================

    @PostMapping("/{storeId}")
    public ResponseEntity<?> sendRequest(
            @PathVariable Long storeId,
            Authentication authentication) {

        try {

            String doctorEmail =
                    authentication.getName();

            DoctorStoreRequest request =
                    requestService.sendRequest(
                            doctorEmail,
                            storeId
                    );

            return ResponseEntity.ok(request);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // ==========================================
    // GET MY REQUESTS
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyRequests(
            Authentication authentication) {

        try {

            String doctorEmail =
                    authentication.getName();

            List<DoctorStoreRequest> requests =
                    requestService.getMyRequests(
                            doctorEmail
                    );

            return ResponseEntity.ok(requests);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // ==========================================
    // STORE ADMIN VIEW INCOMING REQUESTS
    // ==========================================

    @GetMapping("/admin")
    public ResponseEntity<?> getAdminRequests(
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            var admin =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Store admin not found"
                                    ));

            if (!"STORE_ADMIN".equals(admin.getRole())) {

                return ResponseEntity
                        .status(403)
                        .body(Map.of(
                                "message",
                                "Access denied"
                        ));
            }

            List<DoctorStoreRequest> requests =
                    requestService.getAdminRequests(
                            admin.getId()
                    );

            return ResponseEntity.ok(requests);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    // ==========================================
// APPROVE DOCTOR STORE REQUEST
// ==========================================

    @PutMapping("/{requestId}/approve")
    public ResponseEntity<?> approveRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            var admin = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Store admin not found"
                            ));

            if (!"STORE_ADMIN".equals(admin.getRole())) {

                return ResponseEntity
                        .status(403)
                        .body(Map.of(
                                "message",
                                "Access denied"
                        ));
            }

            DoctorStoreRequest request =
                    requestService.approveRequest(
                            requestId,
                            admin.getId()
                    );

            return ResponseEntity.ok(request);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


// ==========================================
// REJECT DOCTOR STORE REQUEST
// ==========================================

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long requestId,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            var admin = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Store admin not found"
                            ));

            if (!"STORE_ADMIN".equals(admin.getRole())) {

                return ResponseEntity
                        .status(403)
                        .body(Map.of(
                                "message",
                                "Access denied"
                        ));
            }

            DoctorStoreRequest request =
                    requestService.rejectRequest(
                            requestId,
                            admin.getId()
                    );

            return ResponseEntity.ok(request);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
}