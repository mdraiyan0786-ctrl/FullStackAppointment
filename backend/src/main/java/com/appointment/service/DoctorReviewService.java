package com.appointment.service;

import com.appointment.entity.Appointment;
import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorReview;
import com.appointment.entity.User;
import com.appointment.repository.AppointmentRepository;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.DoctorReviewRepository;
import com.appointment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorReviewService {

    private final DoctorReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorReviewService(
            DoctorReviewRepository reviewRepository,
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository) {

        this.reviewRepository = reviewRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // CREATE REVIEW
    // ==========================================

    public DoctorReview createReview(
            Long appointmentId,
            Integer rating,
            String comment,
            String patientEmail) {

        // ==========================================
        // VALIDATE RATING
        // ==========================================

        if (rating == null || rating < 1 || rating > 5) {

            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }


        // ==========================================
        // FIND PATIENT
        // ==========================================

        User user =
                userRepository.findByEmail(patientEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // ==========================================
        // FIND APPOINTMENT
        // ==========================================

        Appointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );


        // ==========================================
        // CHECK PATIENT OWNERSHIP
        // ==========================================

        if (appointment.getUser() == null ||
                !appointment.getUser().getId()
                        .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to review this appointment"
            );
        }


        // ==========================================
        // CHECK COMPLETED
        // ==========================================

        if (!"COMPLETED".equals(
                appointment.getStatus())) {

            throw new RuntimeException(
                    "You can only review a completed appointment"
            );
        }


        // ==========================================
        // CHECK EXISTING REVIEW
        // ==========================================

        if (reviewRepository.existsByAppointmentId(
                appointmentId)) {

            throw new RuntimeException(
                    "You have already reviewed this appointment"
            );
        }


        // ==========================================
        // GET DOCTOR
        // ==========================================

        Doctor doctor =
                appointment.getDoctor();

        if (doctor == null) {

            throw new RuntimeException(
                    "Doctor not found for this appointment"
            );
        }


        // ==========================================
        // CREATE REVIEW
        // ==========================================

        DoctorReview review =
                new DoctorReview();

        review.setUser(user);
        review.setDoctor(doctor);
        review.setAppointment(appointment);
        review.setRating(rating);

        if (comment != null) {

            review.setComment(
                    comment.trim()
            );
        }


        // ==========================================
        // SAVE
        // ==========================================

        return reviewRepository.save(review);
    }


    // ==========================================
    // GET DOCTOR REVIEWS
    // ==========================================

    public List<DoctorReview> getDoctorReviews(
            Long doctorId) {

        doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );

        return reviewRepository
                .findByDoctorIdOrderByCreatedAtDesc(
                        doctorId
                );
    }


    // ==========================================
    // GET DOCTOR AVERAGE RATING
    // ==========================================

    public double getDoctorAverageRating(
            Long doctorId) {

        List<DoctorReview> reviews =
                reviewRepository
                        .findByDoctorIdOrderByCreatedAtDesc(
                                doctorId
                        );

        if (reviews.isEmpty()) {

            return 0.0;
        }

        double total = 0;

        for (DoctorReview review : reviews) {

            total += review.getRating();
        }

        double average =
                total / reviews.size();

        return Math.round(
                average * 10.0
        ) / 10.0;
    }


    // ==========================================
    // GET REVIEW COUNT
    // ==========================================

    public long getDoctorReviewCount(
            Long doctorId) {

        return reviewRepository
                .countByDoctorId(doctorId);
    }

    public List<DoctorReview> getMyReviews(
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        return reviewRepository
                .findByDoctorIdOrderByCreatedAtDesc(
                        doctor.getId()
                );
    }

    public double getMyAverageRating(
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        return getDoctorAverageRating(
                doctor.getId()
        );
    }
    public long getMyReviewCount(
            String doctorEmail) {

        Doctor doctor =
                doctorRepository.findByEmail(doctorEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        return getDoctorReviewCount(
                doctor.getId()
        );
    }
}