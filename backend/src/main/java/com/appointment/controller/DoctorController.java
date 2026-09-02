package com.appointment.controller;

import com.appointment.dto.DoctorResponse;
import com.appointment.entity.Doctor;
import com.appointment.security.JwtService;
import com.appointment.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorService doctorService;
    private final JwtService jwtService;

    public DoctorController(
            DoctorService doctorService,
            JwtService jwtService) {

        this.doctorService = doctorService;
        this.jwtService = jwtService;
    }


    // ==========================================
    // DOCTOR REGISTRATION
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(
            @RequestBody Doctor doctor) {

        try {

            Doctor savedDoctor =
                    doctorService.registerDoctor(doctor);

            // Never return password
            savedDoctor.setPassword(null);

            return ResponseEntity.ok(savedDoctor);

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
    // DOCTOR LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(
            @RequestBody Map<String, String> loginRequest) {

        try {

            String email =
                    loginRequest.get("email");

            String password =
                    loginRequest.get("password");

            if (email == null || password == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Email and password are required"
                        ));
            }

            Doctor doctor =
                    doctorService.findByEmail(email);

            boolean passwordMatches =
                    doctorService.checkPassword(
                            password,
                            doctor.getPassword()
                    );

            if (!passwordMatches) {

                return ResponseEntity
                        .status(401)
                        .body(Map.of(
                                "message",
                                "Invalid email or password"
                        ));
            }

            // Generate JWT for doctor
            String token =
                    jwtService.generateToken(
                            doctor.getEmail(),
                            "DOCTOR"
                    );

            // Never return password
            doctor.setPassword(null);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Doctor login successful"
            );

            response.put(
                    "token",
                    token
            );

            response.put(
                    "doctor",
                    doctor
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }
    }


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    @GetMapping
    public List<DoctorResponse> getAllDoctors() {

        return doctorService.getAllDoctors();
    }


    // ==========================================
    // DOCTOR OWN PROFILE
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            Doctor doctor =
                    doctorService.getProfile(email);

            // Never return password
            doctor.setPassword(null);

            return ResponseEntity.ok(doctor);

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
    // UPDATE DOCTOR PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        try {

            String email =
                    authentication.getName();

            String name =
                    (String) request.get("name");

            String phone =
                    (String) request.get("phone");

            String specialization =
                    (String) request.get("specialization");

            String degree =
                    (String) request.get("degree");

            String qualification =
                    (String) request.get("qualification");

            Integer experience =
                    request.get("experience") != null
                            ? ((Number) request
                            .get("experience"))
                            .intValue()
                            : null;

            Double consultationFee =
                    request.get("consultationFee") != null
                            ? ((Number) request
                            .get("consultationFee"))
                            .doubleValue()
                            : null;

            String medicalStore =
                    (String) request.get("medicalStore");

            String availableTime =
                    (String) request.get("availableTime");

            String imageUrl =
                    (String) request.get("imageUrl");

            Doctor updatedDoctor =
                    doctorService.updateProfile(
                            email,
                            name,
                            phone,
                            specialization,
                            degree,
                            qualification,
                            experience,
                            consultationFee,
                            medicalStore,
                            availableTime,
                            imageUrl
                    );

            // Never return password
            updatedDoctor.setPassword(null);

            return ResponseEntity.ok(updatedDoctor);

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
    // GET DOCTOR BY ID
    // ==========================================

    @GetMapping("/{id}")
    public Doctor getDoctorById(
            @PathVariable Long id) {

        return doctorService.getDoctorById(id);
    }


    // ==========================================
    // DELETE DOCTOR
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return "Doctor deleted successfully";
    }
}