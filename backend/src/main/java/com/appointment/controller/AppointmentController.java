package com.appointment.controller;

import com.appointment.entity.Appointment;
import com.appointment.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.time.LocalTime;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    // ==========================================
    // BOOK APPOINTMENT
    // ==========================================

    @PostMapping
    public Appointment bookAppointment(
            @RequestBody Appointment appointment,
            Authentication authentication) {

        String email = authentication.getName();

        return appointmentService.bookAppointment(
                appointment,
                email
        );
    }

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService.getAllAppointments();
    }

    // ==========================================
    // GET LOGGED-IN USER APPOINTMENTS
    // ==========================================

    @GetMapping("/my")
    public List<Appointment> getMyAppointments(
            Authentication authentication) {

        String email = authentication.getName();

        return appointmentService.getMyAppointment(email);
    }

    // ==========================================
// GET DOCTOR APPOINTMENTS
// ==========================================

    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointments(email)
        );
    }

    // ==========================================
    // GET APPOINTMENT BY ID
    // ==========================================

    @GetMapping("/{id:\\d+}")
    public Appointment getAppointmentById(
            @PathVariable Long id) {

        return appointmentService.getAppointmentById(id);
    }

    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    @DeleteMapping("/{id}")
    public String cancelAppointment(
            @PathVariable Long id) {

        appointmentService.cancelAppointment(id);

        return "Appointment cancelled successfully";
    }

    // ==========================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================


    @PreAuthorize("hasRole('STORE_ADMIN')")
    @GetMapping("/store/doctor/{doctorId}")
    public ResponseEntity<?> getStoreDoctorAppointments(
            @PathVariable Long doctorId,
            Authentication authentication) {

        try {

            String storeAdminEmail =
                    authentication.getName();

            List<Appointment> appointments =
                    appointmentService.getStoreDoctorAppointments(
                            doctorId,
                            storeAdminEmail
                    );

            // Never expose passwords
            for (Appointment appointment : appointments) {

                if (appointment.getUser() != null) {
                    appointment.getUser().setPassword(null);
                }

                if (appointment.getDoctor() != null) {
                    appointment.getDoctor().setPassword(null);
                }
            }

            return ResponseEntity.ok(appointments);

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
    // SAVE TEXT PRESCRIPTION
    // ==========================================

    @PutMapping("/{id}/prescription")
    public ResponseEntity<?> savePrescription(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        try {

            String doctorEmail = authentication.getName();

            String prescriptionText =
                    request.get("prescriptionText");

            if (prescriptionText == null ||
                    prescriptionText.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Prescription text cannot be empty"
                        ));
            }

            Appointment appointment =
                    appointmentService.savePrescriptionText(
                            id,
                            doctorEmail,
                            prescriptionText
                    );

            // Never return passwords
            if (appointment.getUser() != null) {
                appointment.getUser().setPassword(null);
            }

            if (appointment.getDoctor() != null) {
                appointment.getDoctor().setPassword(null);
            }

            return ResponseEntity.ok(appointment);

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
    // COMPLETE APPOINTMENT
    // ==========================================

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        String doctorEmail = authentication.getName();

        return ResponseEntity.ok(
                appointmentService.completeAppointment(
                        id,
                        doctorEmail
                )
        );
    }

    // ==========================================
    // UPLOAD PRESCRIPTION FILE
    // ==========================================

    @PostMapping("/{id}/prescription/file")
    public ResponseEntity<?> uploadPrescriptionFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {

            String doctorEmail =
                    authentication.getName();

            Appointment appointment =
                    appointmentService.uploadPrescriptionFile(
                            id,
                            doctorEmail,
                            file
                    );

            // Never return passwords
            if (appointment.getUser() != null) {
                appointment.getUser().setPassword(null);
            }

            if (appointment.getDoctor() != null) {
                appointment.getDoctor().setPassword(null);
            }

            return ResponseEntity.ok(appointment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @PutMapping("/{id}/absent")
    public ResponseEntity<Appointment> markAbsent(@PathVariable Long id,
                                                  Authentication authentication){
        String doctorEmail = authentication.getName();
        return ResponseEntity.ok(appointmentService
                .markAbsent(id,doctorEmail));
    }

    // ==========================================
    // GET MY MEDICAL HISTORY
    // ==========================================
    @GetMapping("/medical-history")
    public ResponseEntity<List<Appointment>> getMyMedicalHistory(
            Authentication authentication
    ){
        String email = authentication.getName();
        List<Appointment> appointments =
                appointmentService.getMyMedicalHistory(email);

        // Never return passwords
        for (Appointment appointment : appointments) {

            if (appointment.getUser() != null) {
                appointment.getUser().setPassword(null);
            }

            if (appointment.getDoctor() != null) {
                appointment.getDoctor().setPassword(null);
            }
        }

        return ResponseEntity.ok(
                appointments
        );
    }

    // ==========================================
// RESCHEDULE APPOINTMENT
// ==========================================

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        try {

            String patientEmail =
                    authentication.getName();


            String date =
                    request.get("appointmentDate");

            String time =
                    request.get("appointmentTime");


            if (date == null || date.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Appointment date is required"
                        ));
            }


            if (time == null || time.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Appointment time is required"
                        ));
            }


            LocalDate newDate =
                    LocalDate.parse(date);

            LocalTime newTime =
                    LocalTime.parse(time);


            Appointment appointment =
                    appointmentService.rescheduleAppointment(
                            id,
                            newDate,
                            newTime,
                            patientEmail
                    );


            // Never expose passwords

            if (appointment.getUser() != null) {
                appointment.getUser().setPassword(null);
            }

            if (appointment.getDoctor() != null) {
                appointment.getDoctor().setPassword(null);
            }


            return ResponseEntity.ok(appointment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/patient/{patientId}/medical-history")
    public ResponseEntity<?> getPatientMedicalHistory(@PathVariable Long patientId,Authentication authentication){
        try{
            String doctorEmail = authentication.getName();
            List<Appointment> history = appointmentService.getPatientMedicalHistoryForDoctor(patientId,doctorEmail);
            return ResponseEntity.ok(history);
        }catch (RuntimeException e){
            return ResponseEntity
                    .status(403)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
}