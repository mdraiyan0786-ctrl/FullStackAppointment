package com.appointment.service;

import com.appointment.dto.DoctorResponse;
import com.appointment.entity.Doctor;
import com.appointment.entity.DoctorReview;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.DoctorReviewRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorReviewRepository doctorReviewRepository;


    public DoctorService(
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            DoctorReviewRepository doctorReviewRepository) {

        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.doctorReviewRepository = doctorReviewRepository;
    }


    // ==========================================
    // SAVE DOCTOR
    // ==========================================

    public Doctor saveDoctor(Doctor doctor) {

        return doctorRepository.save(doctor);
    }


    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    public List<DoctorResponse> getAllDoctors() {

        List<Doctor> doctors =
                doctorRepository.findAll();

        List<DoctorResponse> response =
                new ArrayList<>();

        for (Doctor doctor : doctors) {

            List<DoctorReview> reviews =
                    doctorReviewRepository
                            .findByDoctorIdOrderByCreatedAtDesc(
                                    doctor.getId()
                            );

            double rating = 0.0;

            if (!reviews.isEmpty()) {

                double total = 0;

                for (DoctorReview review : reviews) {

                    total += review.getRating();
                }

                rating =
                        Math.round(
                                (total / reviews.size()) * 10.0
                        ) / 10.0;
            }

            long reviewCount =
                    reviews.size();

            response.add(
                    new DoctorResponse(
                            doctor,
                            rating,
                            reviewCount
                    )
            );
        }

        return response;
    }


    // ==========================================
    // GET DOCTOR BY ID
    // ==========================================

    public Doctor getDoctorById(Long id) {

        return doctorRepository
                .findById(id)
                .orElse(null);
    }


    // ==========================================
    // DELETE DOCTOR
    // ==========================================

    public void deleteDoctor(Long id) {

        doctorRepository.deleteById(id);
    }


    // ==========================================
    // DOCTOR REGISTRATION
    // ==========================================

    public Doctor registerDoctor(Doctor doctor) {

        if (doctorRepository.existsByEmail(
                doctor.getEmail())) {

            throw new RuntimeException(
                    "Doctor already Exist"
            );
        }

        if (doctor.getPhone() != null &&
                doctorRepository.existsByPhone(
                        doctor.getPhone())) {

            throw new RuntimeException(
                    "Doctor Phone Number Already Exist"
            );
        }

        doctor.setPassword(
                passwordEncoder.encode(
                        doctor.getPassword()
                )
        );

        return doctorRepository.save(doctor);
    }


    // ==========================================
    // FIND DOCTOR BY EMAIL
    // ==========================================

    public Doctor findByEmail(String email) {

        return doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );
    }


    // ==========================================
    // CHECK DOCTOR PASSWORD
    // ==========================================

    public boolean checkPassword(
            String rawPassword,
            String encodedPassword) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }


    // ==========================================
    // GET DOCTOR PROFILE
    // ==========================================

    public Doctor getProfile(String email) {

        return doctorRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );
    }


    // ==========================================
    // UPDATE DOCTOR PROFILE
    // ==========================================

    public Doctor updateProfile(
            String email,
            String name,
            String phone,
            String specialization,
            String degree,
            String qualification,
            Integer experience,
            Double consultationFee,
            String medicalStore,
            String availableTime,
            String imageUrl) {

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        doctor.setName(name);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setDegree(degree);
        doctor.setQualification(qualification);
        doctor.setExperience(experience);
        doctor.setConsultationFee(
                consultationFee
        );
        doctor.setMedicalStore(
                medicalStore
        );
        doctor.setAvailableTime(
                availableTime
        );
        doctor.setImageUrl(
                imageUrl
        );

        return doctorRepository.save(doctor);
    }
}
