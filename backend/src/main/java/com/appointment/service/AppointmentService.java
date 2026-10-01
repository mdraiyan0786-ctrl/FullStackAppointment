package com.appointment.service;

import com.appointment.entity.Appointment;
import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorStoreRequest;
import com.appointment.entity.MedicalStore;
import com.appointment.entity.User;
import com.appointment.repository.AppointmentRepository;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.DoctorStoreRequestRepository;
import com.appointment.repository.MedicalStoreRepository;
import com.appointment.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final NotificationService notificationService;
    private final MedicalStoreRepository medicalStoreRepository;
    private final DoctorStoreRequestRepository doctorStoreRequestRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            NotificationService notificationService,
            MedicalStoreRepository medicalStoreRepository,
            DoctorStoreRequestRepository doctorStoreRequestRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.notificationService = notificationService;
        this.medicalStoreRepository = medicalStoreRepository;
        this.doctorStoreRequestRepository =
                doctorStoreRequestRepository;
    }


    // ==========================================
    // BOOK APPOINTMENT
    // ==========================================

    public Appointment bookAppointment(
            Appointment appointment,
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        // ==========================================
        // CHECK DOCTOR
        // ==========================================

        if (appointment.getDoctor() == null ||
                appointment.getDoctor().getId() == null) {

            throw new RuntimeException(
                    "Doctor is required"
            );
        }


        Doctor doctor =
                doctorRepository.findById(
                                appointment.getDoctor().getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        // ==========================================
        // MEDICAL STORE
        // ==========================================

        MedicalStore medicalStore = null;


        if (appointment.getMedicalStore() != null &&
                appointment.getMedicalStore().getId() != null) {

            Long storeId =
                    appointment.getMedicalStore().getId();


            // ==========================================
            // FIND MEDICAL STORE
            // ==========================================

            medicalStore =
                    medicalStoreRepository
                            .findById(storeId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Medical store not found"
                                    ));


            // ==========================================
            // CHECK DOCTOR-STORE REQUEST
            // ==========================================

            DoctorStoreRequest request =
                    doctorStoreRequestRepository
                            .findByDoctorIdAndMedicalStoreId(
                                    doctor.getId(),
                                    medicalStore.getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "This doctor is not associated with this medical store"
                                    ));


            // ==========================================
            // CHECK APPROVAL
            // ==========================================

            if (!"APPROVED".equalsIgnoreCase(
                    request.getStatus())) {

                throw new RuntimeException(
                        "This doctor is not approved to work at this medical store"
                );
            }
        }


        // ==========================================
        // CHECK DUPLICATE BOOKING
        // ==========================================

        boolean alreadyBooked =
                appointmentRepository
                        .existsByUserIdAndDoctorIdAndAppointmentDateAndStatus(
                                user.getId(),
                                doctor.getId(),
                                appointment.getAppointmentDate(),
                                "BOOKED"
                        );

        if (alreadyBooked) {

            throw new RuntimeException(
                    "You have already booked an appointment with this doctor on this day."
            );
        }


        // ==========================================
        // SET APPOINTMENT DETAILS
        // ==========================================

        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setMedicalStore(medicalStore);
        appointment.setStatus("BOOKED");


        // ==========================================
        // SAVE APPOINTMENT
        // ==========================================

        Appointment savedAppointment =
                appointmentRepository.save(
                        appointment
                );


        // ==========================================
        // NOTIFY MEDICAL STORE ADMIN
        // ==========================================

        if (medicalStore != null &&
                medicalStore.getAdmin() != null) {

            notificationService.createNotification(
                    medicalStore.getAdmin(),
                    "New appointment booked at "
                            + medicalStore.getName()
                            + ". Patient: "
                            + appointment.getPatientName()
                            + ", Phone: "
                            + appointment.getPhone()
                            + ", Doctor: "
                            + doctor.getName()
                            + ", Date: "
                            + appointment.getAppointmentDate()
                            + ", Time: "
                            + appointment.getAppointmentTime()
            );
        }


        // ==========================================
        // NOTIFY PATIENT
        // ==========================================

        notificationService.createNotification(
                user,
                "Your appointment with "
                        + doctor.getName()
                        + " has been booked successfully for "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
        );


        return savedAppointment;
    }

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }


    // ==========================================
    // GET APPOINTMENT BY ID
    // ==========================================

    public Appointment getAppointmentById(Long id) {

        return appointmentRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // CANCEL APPOINTMENT
    // ==========================================

    public void cancelAppointment(Long id) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment Not Found"
                                ));


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if ("COMPLETED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Completed Appointments Cannot be Cancelled"
            );
        }

        if ("CANCELLED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Appointment is already cancelled."
            );
        }


        // ==========================================
        // CANCEL
        // ==========================================

        appointment.setStatus("CANCELLED");

        appointmentRepository.save(
                appointment
        );


        // ==========================================
        // NOTIFY PATIENT
        // ==========================================

        notificationService.createNotification(
                appointment.getUser(),
                "Your appointment with "
                        + appointment.getDoctor().getName()
                        + " on "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
                        + " has been cancelled."
        );
    }


    // ==========================================
    // GET LOGGED-IN USER APPOINTMENTS
    // ==========================================

    public List<Appointment> getMyAppointment(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not Found"
                                ));

        return appointmentRepository.findByUserId(
                user.getId()
        );
    }


    // ==========================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================

    public List<Appointment> getDoctorAppointments(
            String email) {

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));

        return appointmentRepository.findByDoctorId(
                doctor.getId()
        );
    }


    // ==========================================
    // GET STORE DOCTOR APPOINTMENTS
    // STORE ADMIN ONLY
    // ==========================================

    public List<Appointment> getStoreDoctorAppointments(
            Long doctorId,
            String storeAdminEmail) {

        User storeAdmin =
                userRepository.findByEmail(
                                storeAdminEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store admin not found"
                                ));


        // ==========================================
        // CHECK ROLE
        // ==========================================

        if (!"STORE_ADMIN".equalsIgnoreCase(
                storeAdmin.getRole())) {

            throw new RuntimeException(
                    "Only store admins can view store appointments"
            );
        }


        // ==========================================
        // FIND STORE
        // ==========================================

        MedicalStore store =
                medicalStoreRepository
                        .findByAdminId(
                                storeAdmin.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical store not found"
                                ));


        // ==========================================
        // FIND DOCTOR
        // ==========================================

        Doctor doctor =
                doctorRepository.findById(
                                doctorId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        // ==========================================
        // CHECK DOCTOR IS APPROVED FOR THIS STORE
        // ==========================================

        DoctorStoreRequest request =
                doctorStoreRequestRepository
                        .findByDoctorIdAndMedicalStoreId(
                                doctor.getId(),
                                store.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "This doctor is not associated with your medical store"
                                ));


        if (!"APPROVED".equalsIgnoreCase(
                request.getStatus())) {

            throw new RuntimeException(
                    "This doctor is not approved for your medical store"
            );
        }


        // ==========================================
        // GET APPOINTMENTS
        // ==========================================

        return appointmentRepository
                .findByDoctorIdAndMedicalStoreId(
                        doctor.getId(),
                        store.getId()
                );
    }


    // ==========================================
    // SAVE TEXT PRESCRIPTION
    // ==========================================

    public Appointment savePrescriptionText(
            Long appointmentId,
            String doctorEmail,
            String prescriptionText) {

        Doctor doctor =
                doctorRepository.findByEmail(
                                doctorEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        Appointment appointment =
                appointmentRepository.findById(
                                appointmentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                ));


        // ==========================================
        // CHECK DOCTOR OWNERSHIP
        // ==========================================

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor().getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to modify this appointment"
            );
        }


        // ==========================================
        // CHECK CANCELLED
        // ==========================================

        if ("CANCELLED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Cancelled appointment cannot have a prescription"
            );
        }


        // ==========================================
        // CHECK PRESCRIPTION
        // ==========================================

        if (prescriptionText == null ||
                prescriptionText.trim().isEmpty()) {

            throw new RuntimeException(
                    "Prescription cannot be empty"
            );
        }


        // ==========================================
        // SAVE PRESCRIPTION
        // ==========================================

        appointment.setPrescriptionText(
                prescriptionText.trim()
        );

        appointment.setStatus("COMPLETED");


        Appointment savedAppointment =
                appointmentRepository.save(
                        appointment
                );


        // ==========================================
        // NOTIFY PATIENT
        // ==========================================

        notificationService.createNotification(
                appointment.getUser(),
                "A prescription has been added for your appointment with "
                        + appointment.getDoctor().getName()
                        + " on "
                        + appointment.getAppointmentDate()
        );


        return savedAppointment;
    }


    // ==========================================
    // MANUALLY COMPLETE APPOINTMENT
    // ==========================================

    public Appointment completeAppointment(
            Long id,
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(
                                doctorEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                ));


        // ==========================================
        // CHECK DOCTOR OWNERSHIP
        // ==========================================

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor()
                        .getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to modify this appointment"
            );
        }


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if ("CANCELLED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Cancelled appointment cannot be completed"
            );
        }

        if ("COMPLETED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Appointment is already completed"
            );
        }

        if ("ABSENT".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Absent appointment cannot be completed"
            );
        }


        // ==========================================
        // COMPLETE
        // ==========================================

        appointment.setStatus("COMPLETED");


        Appointment savedAppointment =
                appointmentRepository.save(
                        appointment
                );


        // ==========================================
        // NOTIFY PATIENT
        // ==========================================

        notificationService.createNotification(
                appointment.getUser(),
                "Your appointment with "
                        + appointment.getDoctor().getName()
                        + " on "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
                        + " has been completed."
        );


        return savedAppointment;
    }


    // ==========================================
    // UPLOAD PRESCRIPTION FILE
    // ==========================================

    public Appointment uploadPrescriptionFile(
            Long appointmentId,
            String doctorEmail,
            MultipartFile file) {

        Doctor doctor =
                doctorRepository.findByEmail(
                                doctorEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        Appointment appointment =
                appointmentRepository.findById(
                                appointmentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                ));


        // ==========================================
        // CHECK DOCTOR OWNERSHIP
        // ==========================================

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor().getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to modify this appointment"
            );
        }


        // ==========================================
        // CHECK CANCELLED
        // ==========================================

        if ("CANCELLED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Cancelled appointment cannot have a prescription"
            );
        }


        // ==========================================
        // CHECK FILE
        // ==========================================

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Prescription file cannot be empty"
            );
        }


        // ==========================================
        // CHECK FILE TYPE
        // ==========================================

        String contentType =
                file.getContentType();

        if (contentType == null ||
                (
                        !contentType.equals(
                                "application/pdf"
                        )
                                &&
                                !contentType.equals(
                                        "image/jpeg"
                                )
                                &&
                                !contentType.equals(
                                        "image/png"
                                )
                )) {

            throw new RuntimeException(
                    "Only PDF, JPG, JPEG and PNG files are allowed"
            );
        }


        try {

            // ==========================================
            // CREATE UPLOAD DIRECTORY
            // ==========================================

            Path uploadDirectory =
                    Paths.get(
                            "uploads",
                            "prescriptions"
                    );

            Files.createDirectories(
                    uploadDirectory
            );


            // ==========================================
            // GENERATE UNIQUE FILE NAME
            // ==========================================

            String originalFilename =
                    file.getOriginalFilename();

            String extension = "";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension =
                        originalFilename.substring(
                                originalFilename.lastIndexOf(".")
                        );
            }


            String filename =
                    UUID.randomUUID()
                            + extension;

            Path filePath =
                    uploadDirectory.resolve(
                            filename
                    );


            // ==========================================
            // SAVE FILE
            // ==========================================

            Files.copy(
                    file.getInputStream(),
                    filePath
            );


            // ==========================================
            // SAVE FILE URL
            // ==========================================

            appointment.setPrescriptionFileUrl(
                    "/uploads/prescriptions/"
                            + filename
            );


            // ==========================================
            // MARK COMPLETED
            // ==========================================

            appointment.setStatus("COMPLETED");


            Appointment savedAppointment =
                    appointmentRepository.save(
                            appointment
                    );


            // ==========================================
            // NOTIFY PATIENT
            // ==========================================

            notificationService.createNotification(
                    appointment.getUser(),
                    "A prescription has been uploaded for your appointment with "
                            + appointment.getDoctor().getName()
                            + " on "
                            + appointment.getAppointmentDate()
            );


            return savedAppointment;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload prescription file"
            );
        }
    }


    // ==========================================
    // MARK APPOINTMENT AS ABSENT
    // ==========================================

    public Appointment markAbsent(Long appointmentId, String doctorEmail) {

        // ==========================================
        // FIND DOCTOR
        // ==========================================

        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                ));


        // ==========================================
        // FIND APPOINTMENT
        // ==========================================

        Appointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                ));


        // ==========================================
        // CHECK DOCTOR OWNERSHIP
        // ==========================================

        if (appointment.getDoctor() == null ||
                !appointment.getDoctor().getId()
                        .equals(doctor.getId())) {

            throw new RuntimeException(
                    "You are not authorized to update this appointment"
            );
        }


        // ==========================================
        // CHECK CURRENT STATUS
        // ==========================================

        if ("COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Completed appointment cannot be marked absent"
            );
        }

        if ("CANCELLED".equalsIgnoreCase(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Cancelled appointment cannot be marked absent"
            );
        }

        if ("ABSENT".equalsIgnoreCase(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Appointment is already marked absent"
            );
        }


        // ==========================================
        // CHECK APPOINTMENT TIME
        // ==========================================

        LocalDateTime appointmentDateTime =
                LocalDateTime.of(
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        if (LocalDateTime.now()
                .isBefore(appointmentDateTime)) {

            throw new RuntimeException(
                    "Appointment cannot be marked absent before the appointment time"
            );
        }


        // ==========================================
        // MARK ABSENT
        // ==========================================

        appointment.setStatus("ABSENT");

        Appointment savedAppointment =
                appointmentRepository.save(appointment);


        // ==========================================
        // NOTIFY MEDICAL STORE ADMIN
        // ==========================================

        MedicalStore medicalStore =
                appointment.getMedicalStore();

        if (medicalStore != null &&
                medicalStore.getAdmin() != null) {

            notificationService.createNotification(
                    medicalStore.getAdmin(),

                    "Patient "
                            + appointment.getPatientName()
                            + " was marked absent for Dr. "
                            + doctor.getName()
                            + "'s appointment at "
                            + medicalStore.getName()
                            + ". Phone: "
                            + appointment.getPhone()
                            + ", Date: "
                            + appointment.getAppointmentDate()
                            + ", Time: "
                            + appointment.getAppointmentTime()
            );
        }


        return savedAppointment;
    }


    // ==========================================
    // GET MY MEDICAL HISTORY
    // ==========================================

    public List<Appointment> getMyMedicalHistory(
            String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                ));

        return appointmentRepository
                .findByUserIdAndStatus(
                        user.getId(),
                        "COMPLETED"
                );
    }


    // ==========================================
    // RESCHEDULE APPOINTMENT
    // ==========================================

    public Appointment rescheduleAppointment(
            Long id,
            LocalDate newDate,
            LocalTime newTime,
            String patientEmail) {

        User user =
                userRepository.findByEmail(
                                patientEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"
                                ));


        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment Not Found"
                                ));


        // ==========================================
        // CHECK PATIENT OWNERSHIP
        // ==========================================

        if (appointment.getUser() == null ||
                !appointment.getUser()
                        .getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to reschedule this appointment"
            );
        }


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if ("CANCELLED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Cancelled appointment cannot be rescheduled"
            );
        }

        if ("COMPLETED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Completed appointment cannot be rescheduled"
            );
        }

        if ("ABSENT".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "Absent appointment cannot be rescheduled"
            );
        }


        // ==========================================
        // CHECK NEW DATE
        // ==========================================

        if (newDate == null) {

            throw new RuntimeException(
                    "Appointment date is required"
            );
        }

        if (newDate.isBefore(
                LocalDate.now())) {

            throw new RuntimeException(
                    "Appointment date cannot be in the past"
            );
        }


        // ==========================================
        // CHECK NEW TIME
        // ==========================================

        if (newTime == null) {

            throw new RuntimeException(
                    "Appointment time is required"
            );
        }


        // ==========================================
        // CHECK SAME DATE AND TIME
        // ==========================================

        if (appointment.getAppointmentDate()
                .equals(newDate)
                &&
                appointment.getAppointmentTime()
                        .equals(newTime)) {

            throw new RuntimeException(
                    "New appointment time is the same as the current time"
            );
        }


        // ==========================================
        // CHECK DUPLICATE BOOKING
        // ==========================================

        boolean alreadyBooked =
                appointmentRepository
                        .existsByUserIdAndDoctorIdAndAppointmentDateAndStatus(
                                user.getId(),
                                appointment.getDoctor().getId(),
                                newDate,
                                "BOOKED"
                        );

        if (alreadyBooked) {

            throw new RuntimeException(
                    "You already have another appointment with this doctor on this day"
            );
        }


        // ==========================================
        // UPDATE APPOINTMENT
        // ==========================================

        appointment.setAppointmentDate(
                newDate
        );

        appointment.setAppointmentTime(
                newTime
        );

        appointment.setStatus(
                "BOOKED"
        );


        Appointment savedAppointment =
                appointmentRepository.save(
                        appointment
                );


        // ==========================================
        // NOTIFY PATIENT
        // ==========================================

        notificationService.createNotification(
                user,
                "Your appointment with "
                        + appointment.getDoctor().getName()
                        + " has been rescheduled to "
                        + newDate
                        + " at "
                        + newTime
        );


        return savedAppointment;
    }


    // ==========================================
    // GET PATIENT MEDICAL HISTORY FOR DOCTOR
    // ==========================================

    public List<Appointment>
    getPatientMedicalHistoryForDoctor(
            Long patientId,
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(
                                doctorEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor Not Found"
                                ));


        User patient =
                userRepository.findById(
                                patientId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient Not Found"
                                ));


        // ==========================================
        // CHECK DOCTOR-PATIENT RELATIONSHIP
        // ==========================================

        boolean hasAppointment =
                appointmentRepository
                        .existsByDoctorIdAndUserId(
                                doctor.getId(),
                                patient.getId()
                        );

        if (!hasAppointment) {

            throw new RuntimeException(
                    "You are not authorized to view this patient's medical history"
            );
        }


        // ==========================================
        // GET COMPLETED APPOINTMENTS
        // ==========================================

        return appointmentRepository
                .findByUserIdAndStatus(
                        patient.getId(),
                        "COMPLETED"
                );
    }
}