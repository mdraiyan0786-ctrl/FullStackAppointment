package com.appointment.controller;

import com.appointment.entity.DoctorStoreRequest;
import com.appointment.service.DoctorStoreRequestService;
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

    public DoctorStoreRequestController(
            DoctorStoreRequestService requestService) {

        this.requestService = requestService;
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
}